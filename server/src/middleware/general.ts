import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import db from '../config'
import { User, UserRequest } from '../interfaces'
import { BUCKET, s3 } from '../utils/awsS3'

// Verify if a user already exists in the database
export const verifyNew =
  (model: string, para: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doc = await db(model)
        .where({ [para]: req.body[para] })
        .first()

      if (!doc) {
        return next()
      }

      res.status(409).json({ error: 'User already exists' })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

// Hash a password
export const hash = (password: string): string =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Upload handler for specific model
// Function for handling uploads
export const uploadHandler =
  (model: string): any =>
  async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: 'fail',
          error: `No ${model} files uploaded.`
        })
      }

      const filesToProcess = Array.isArray(req.files)
        ? req.files.filter((file) => file.fieldname === model)
        : []

      if (filesToProcess.length === 0) {
        return res.status(400).json({
          status: 'fail',
          error: `No ${model} files uploaded.`
        })
      }

      await Promise.all(
        filesToProcess.map(async (file: any) => {
          const user_id = (req.user as User)?.id
          const filename = file.location
          const doc = {
            filename,
            user_id
          }
          await db(model).insert(doc)
        })
      )

      next()
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

// Multer configurations
const uploadConfig = multer({
  storage: multerS3({
    bucket: BUCKET,
    s3: s3,
    key: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1]
      cb(null, `img-${Date.now()}.${ext}`)
    }
  })
})

const uploadLocal = multer({
  storage: multer.memoryStorage()
})

export const uploadbulk = uploadLocal.single('bulk')
export const uploadimg = uploadConfig.any()

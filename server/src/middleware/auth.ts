import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import db from '../config'
import { UserRequest } from '../interfaces'

// Define the shape of user requests

export const verifyToken = (
  token: string,
  secret: string
): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err)
      }
      resolve(decoded as jwt.JwtPayload)
    })
  })
}

export const verifyLogin = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body

    if (!email) {
      res.status(422).json({ error: 'All fields are required' })
      return
    }

    const user = await db('users').where({ email }).first()

    if (!user) {
      res.status(404).json({ error: 'Invalid Login Credentials' })
      return
    }

    next()
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// Middleware to verify a new user
export const verifyNewUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body

    if (!email) {
      res.status(422).json({ error: 'All fields are required' })
      return
    }

    const user = await db('users').where({ email }).first()

    if (user) {
      res.status(422).json({ error: 'User already exists' })
      return
    }

    next()
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// Middleware to secure login
export const secureLogin = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.giveback

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      res
        .status(401)
        .json({ error: 'You are not logged in! Please log in to get access.' })
      return
    }

    const decoded = await verifyToken(token, process.env.JWT_SECRET as string)

    const user = await db('users')
      .select('id', 'role')
      .where({ id: decoded.id })
      .first()

    if (!user) {
      res.status(404).json({ error: 'User not found' })

      return
    }

    req.user = { id: user.id, role: user.role }

    next()
  } catch (error: any) {
    res.status(401).json({
      error: error.message
    })
  }
}

import { NextFunction, Response } from 'express'
import db from '../config'
import { User, UserRequest } from '../interfaces'

export const createAddress = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id

    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to access this resource.'
      })
    }

    const { state, city_lga, address } = req.body

    const missingFields: string[] = []
    if (!state) missingFields.push('state')
    if (!city_lga) missingFields.push('city_lga')
    if (!address) missingFields.push('address')

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: `Missing required field(s): ${missingFields.join(', ')}`
      })
    }

    const newAddress = {
      state,
      city_lga,
      address,
      user_id: userId
    }

    await db('address').insert(newAddress)
    next()
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
      error: error.message
    })
  }
}

export const createBank = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id

    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to access this resource.'
      })
    }

    const { bankName, accountName, accountNumber } = req.body

    const missingFields: string[] = []
    if (!bankName) missingFields.push('bankName')
    if (!accountName) missingFields.push('accountName')
    if (!accountNumber) missingFields.push('accountNumber')

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: `Missing required field(s): ${missingFields.join(', ')}`
      })
    }

    const newBank = {
      bankName,
      accountName,
      accountNumber,
      user_id: userId
    }

    await db('banks').insert(newBank)
    next()
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
      error: error.message
    })
  }
}

export const updateBank = async (req: any, res: Response) => {
  try {
    const userId = (req.user as User)?.id

    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to access this resource.'
      })
    }

    const { bankName, accountName, accountNumber } = req.body

    const updatedBank = {
      bankName,
      accountName,
      accountNumber
    }

    await db('banks').where('user_id', userId).update(updatedBank)

    res.status(200).json({
      status: 'success',
      message: 'Banking details updated successfully'
    })
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong.',
      error: error.message
    })
  }
}

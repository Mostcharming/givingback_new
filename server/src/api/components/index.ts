import express from 'express'
import authRoute from './auth/auth.routes'

const router = express.Router()

router.use('/auth', authRoute)

export default router
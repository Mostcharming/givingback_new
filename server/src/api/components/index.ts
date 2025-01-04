import express from 'express'
import authRoute from './auth/auth.routes'
import communityRoute from './community/community.routes'
import contactRoute from './contact_us/contact.routes'
import landingRoute from './landing/landing.routes'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/', contactRoute)
router.use('/', landingRoute)
router.use('/community', communityRoute)

export default router

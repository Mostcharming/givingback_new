import express from 'express'

import { sendContactEmail } from './contact.controller'

const router = express.Router()

router.post('/send_email', sendContactEmail)

export default router

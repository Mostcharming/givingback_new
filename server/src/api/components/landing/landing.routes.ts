import express from 'express'

import { getAllProjectsForAllUsers } from './landing.controller'

const router = express.Router()

router.get('/allprojects', getAllProjectsForAllUsers)

export default router

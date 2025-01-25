import express from 'express'

import {
  getAllNames,
  getAllProjectsForAllUsers,
  handleDonation,
  makeDonation,
  stripeHandler
} from './landing.controller'

const router = express.Router()

router.get('/allprojects', getAllProjectsForAllUsers)
router.get('/areas', getAllNames)

router.route('/donate').post(makeDonation)
router.route('/fund').post(handleDonation)

router.route('/stripe_session').post(stripeHandler)

export default router

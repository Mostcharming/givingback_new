import express from 'express'
import { uploadbulk } from '../../../middleware/general'
import {
  addPaymentGateway,
  addRates,
  bulk,
  deletePaymentGateway,
  feedBack,
  getAllDonors,
  getCounts,
  getDonations,
  getPaymentGateways,
  getRates,
  sample,
  updatePaymentGateway,
  updateProject,
  updateUserByAdmin
} from './admin.controller'

const router = express.Router()

router.get('/dashboard', getCounts)

router.route('/users/:id').post(updateUserByAdmin as any)
router.route('/bulk').get(sample).post(uploadbulk, bulk)
router.route('/transactions').get(getDonations as any)
router.post('/project/:id/message', feedBack as any)
router.route('/previous-project/:id').post(updateProject as any)
router.get('/payment-gateways', getPaymentGateways)

// Add a new payment gateway
router.post('/payment-gateways', addPaymentGateway)

// Update a payment gateway
router.put('/payment-gateways/:id', updatePaymentGateway)

// Delete a payment gateway
router.delete('/payment-gateways/:id', deletePaymentGateway)

router.get('/rates', getRates)
router.post('/rates', addRates)

router
  .route('/donor')
  // .post(secureLogin, uploadimg, verifyNewUser, admin.createDonor)
  .get(getAllDonors)

export default router

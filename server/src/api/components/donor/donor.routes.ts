import express from 'express'

import { secureLogin } from '../../../middleware/auth'
import { uploadHandler, uploadimg } from '../../../middleware/general'
import {
  addRecipient,
  donate,
  feedBack,
  getAllUserPresentProjects,
  getAllUsers,
  getCountsHandler,
  getRecipient,
  newDonor,
  sendMessageToNGO
} from './donor.controller'

const router = express.Router()

router.get('/dashboard', getCountsHandler as any)
router.get('/users', getAllUsers as any)

router
  .route('/onboard')
  .post(
    secureLogin,
    uploadimg,
    uploadHandler('userimg'),
    uploadHandler('cacidimage'),
    newDonor as any
  )
router
  .route('/onboardp')
  .post(uploadimg, uploadHandler('userimg'), newDonor as any)
router.post('/ngos/:id/message', sendMessageToNGO as any)
router.post('/project/:id/message', feedBack as any)
router
  .route('/beneficiary')
  .post(addRecipient as any)
  .get(getRecipient as any)
  .put(donate as any)

router.route('/users/:id/projects').get(getAllUserPresentProjects as any)

export default router

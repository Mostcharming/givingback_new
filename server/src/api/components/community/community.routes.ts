import express from 'express'
import {
  addMessage,
  getMessages,
  likeMessage,
  reactToMessage
} from './community.controller'

const router = express.Router()

router
  .route('/:id')
  .get(getMessages)
  .patch(likeMessage)
  .put(reactToMessage)
  .post(addMessage)

export default router

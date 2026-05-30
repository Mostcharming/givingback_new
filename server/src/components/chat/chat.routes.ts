import express from "express";
import { secureLogin } from "../../middleware/auth";
import {
  deleteChat,
  deleteMessage,
  getChatMessages,
  getChats,
  getOrCreateChat,
  markChatAsRead,
  markMessageAsRead,
  sendMessage,
} from "./chat.controller";

const router = express.Router();

// All chat routes require authentication
router.use(secureLogin);

// Chat routes
router.route("/").get(getChats);
router.route("/").post(getOrCreateChat);
router.route("/:chatId").delete(deleteChat);

// Message routes
router.route("/:chatId/messages").get(getChatMessages);
router.route("/:chatId/messages").post(sendMessage);
router.route("/messages/:messageId").delete(deleteMessage);

// Read receipts
router.route("/:chatId/mark-as-read").put(markChatAsRead);
router.route("/messages/:messageId/read").put(markMessageAsRead);

export default router;

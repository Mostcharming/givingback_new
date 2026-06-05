"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const chat_controller_1 = require("./chat.controller");
const router = express_1.default.Router();
// All chat routes require authentication
router.use(auth_1.secureLogin);
// Chat routes
router.route("/").get(chat_controller_1.getChats);
router.route("/").post(chat_controller_1.getOrCreateChat);
router.route("/events/stream").get(chat_controller_1.streamChatEvents);
router.route("/search-donor").post(chat_controller_1.searchDonor);
router.route("/:chatId").delete(chat_controller_1.deleteChat);
// Message routes
router.route("/:chatId/messages").get(chat_controller_1.getChatMessages);
router.route("/:chatId/messages").post(chat_controller_1.sendMessage);
router.route("/messages/:messageId").delete(chat_controller_1.deleteMessage);
// Read receipts
router.route("/:chatId/mark-as-read").put(chat_controller_1.markChatAsRead);
router.route("/messages/:messageId/read").put(chat_controller_1.markMessageAsRead);
exports.default = router;

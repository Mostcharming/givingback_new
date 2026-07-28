"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const community_controller_1 = require("./community.controller");
const router = express_1.default.Router();
router
    .route('/:id')
    .get(community_controller_1.getMessages)
    .patch(community_controller_1.likeMessage)
    .put(community_controller_1.reactToMessage)
    .post(community_controller_1.addMessage);
exports.default = router;

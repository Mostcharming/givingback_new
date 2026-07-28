"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = exports.reactToMessage = exports.likeMessage = exports.getMessages = void 0;
const config_1 = __importDefault(require("../../config"));
// Fetch messages for a project
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const totalCount = yield (0, config_1.default)("community")
            .where("project_id", id)
            .count()
            .first();
        const totalItems = parseInt(String(totalCount === null || totalCount === void 0 ? void 0 : totalCount["count(*)"]) || "0");
        const totalPages = Math.ceil(totalItems / limit);
        const messages = yield (0, config_1.default)("community")
            .where("project_id", id)
            .select("id", "messages", "name", "phone", "likes", "reactions", "createdAt")
            .limit(limit)
            .offset(offset);
        res.status(200).json({
            totalItems,
            totalPages,
            currentPage: page,
            messages,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to fetch messages" });
    }
});
exports.getMessages = getMessages;
// Increment likes for a message
const likeMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = req.params.id;
        yield (0, config_1.default)("community").where("id", messageId).increment("likes", 1);
        res.status(200).json({ message: "Likes increased successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to increase likes" });
    }
});
exports.likeMessage = likeMessage;
// Increment reactions for a message
const reactToMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = req.params.id;
        yield (0, config_1.default)("community").where("id", messageId).increment("reactions", 1);
        res.status(200).json({ message: "Reactions increased successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to increase reactions" });
    }
});
exports.reactToMessage = reactToMessage;
// Add a new message
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, message, phone } = req.body;
        const projectId = req.params.id;
        const missingFields = [];
        if (!projectId)
            missingFields.push("projectId");
        if (!name)
            missingFields.push("name");
        if (!message)
            missingFields.push("message");
        if (missingFields.length > 0) {
            res.status(400).json({
                status: "fail",
                error: `Missing required field(s): ${missingFields.join(", ")}`,
            });
            return;
        }
        const newMessage = {
            project_id: projectId,
            name,
            messages: message,
            phone,
            likes: 0,
            reactions: 0,
        };
        const [insertedMessage] = yield (0, config_1.default)("community")
            .insert(newMessage)
            .returning("*");
        res.status(201).json({
            message: "Message added successfully",
            insertedMessage,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Unable to add a new message" });
    }
});
exports.addMessage = addMessage;

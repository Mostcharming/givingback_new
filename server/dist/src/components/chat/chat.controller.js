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
exports.deleteChat = exports.deleteMessage = exports.markChatAsRead = exports.markMessageAsRead = exports.streamChatEvents = exports.sendMessage = exports.getChatMessages = exports.searchUsers = exports.getOrCreateChat = exports.getChats = void 0;
const config_1 = __importDefault(require("../../config"));
const chat_realtime_1 = require("./chat.realtime");
const normalizeChatUserType = (userType) => {
    if (!userType) {
        return null;
    }
    const normalized = userType.toLowerCase();
    return normalized === "corporate" ? "donor" : normalized;
};
const getChatParticipantDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!userId) {
        return null;
    }
    const user = yield (0, config_1.default)("users")
        .where("id", userId)
        .select("id", "email", "role")
        .first();
    if (!user) {
        return null;
    }
    const normalizedRole = (_a = user.role) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const profile = normalizedRole === "ngo"
        ? yield (0, config_1.default)("organizations")
            .where("user_id", userId)
            .select("name")
            .first()
        : yield (0, config_1.default)("donors")
            .where("user_id", userId)
            .select("name")
            .first();
    return {
        id: user.id,
        email: user.email,
        name: (profile === null || profile === void 0 ? void 0 : profile.name) || null,
        role: normalizedRole,
    };
});
const getExistingChatBetweenUsers = (firstUserId, secondUserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!firstUserId || !secondUserId) {
        return null;
    }
    return (0, config_1.default)("chat")
        .where((builder) => {
        builder
            .where({
            participant1_user_id: firstUserId,
            participant2_user_id: secondUserId,
        })
            .orWhere({
            participant1_user_id: secondUserId,
            participant2_user_id: firstUserId,
        });
    })
        .orderBy("id", "asc")
        .first();
});
const getChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (!userId || !userRole) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const chats = yield (0, config_1.default)("chat")
            .where("participant1_user_id", userId)
            .orWhere("participant2_user_id", userId);
        const enrichedChats = yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
            const isParticipant1 = chat.participant1_user_id === userId;
            const senderUserId = isParticipant1
                ? chat.participant2_user_id
                : chat.participant1_user_id;
            const unreadMessages = yield (0, config_1.default)("chat_message")
                .where({
                chat_id: chat.id,
                sender_user_id: senderUserId,
                status: "sent",
            })
                .count("id as count")
                .first();
            const unreadCount = (unreadMessages === null || unreadMessages === void 0 ? void 0 : unreadMessages.count) || 0;
            const updateField = isParticipant1
                ? "participant1_unread_count"
                : "participant2_unread_count";
            yield (0, config_1.default)("chat")
                .where("id", chat.id)
                .update({ [updateField]: unreadCount });
            const otherParticipantId = isParticipant1
                ? chat.participant2_user_id
                : chat.participant1_user_id;
            const otherParticipantType = isParticipant1
                ? chat.participant2_user_type
                : chat.participant1_user_type;
            // Only fetch user if otherParticipantId is not null (admin can have null ID)
            const otherParticipant = otherParticipantId
                ? yield getChatParticipantDetails(otherParticipantId)
                : null;
            const lastMessage = yield (0, config_1.default)("chat_message")
                .where("chat_id", chat.id)
                .orderBy("created_at", "desc")
                .select("id", "message", "sender_user_id", "created_at", "status")
                .first();
            return {
                id: chat.id,
                otherParticipant: {
                    userId: otherParticipantId,
                    userType: (otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.role) ||
                        normalizeChatUserType(otherParticipantType),
                    email: otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.email,
                    name: otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.name,
                },
                unreadCount,
                lastMessage: lastMessage
                    ? {
                        id: lastMessage.id,
                        message: lastMessage.message,
                        senderId: lastMessage.sender_user_id,
                        timestamp: lastMessage.created_at,
                        status: lastMessage.status,
                    }
                    : null,
                createdAt: chat.created_at,
                updatedAt: chat.updated_at,
            };
        })));
        enrichedChats.sort((a, b) => {
            var _a, _b;
            return new Date(((_a = b.lastMessage) === null || _a === void 0 ? void 0 : _a.timestamp) || b.updatedAt).getTime() -
                new Date(((_b = a.lastMessage) === null || _b === void 0 ? void 0 : _b.timestamp) || a.updatedAt).getTime();
        });
        res.status(200).json({
            message: "Chats fetched successfully",
            chats: enrichedChats,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to fetch chats",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getChats = getChats;
const getOrCreateChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const { otherUserId, otherUserType, otherParticipant } = req.body;
        // Support both flat structure and nested otherParticipant structure
        const finalOtherUserId = otherUserId || (otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.userId) || null;
        const finalOtherUserType = otherUserType || (otherParticipant === null || otherParticipant === void 0 ? void 0 : otherParticipant.userType);
        if (!userId || !userRole || !finalOtherUserType) {
            res.status(400).json({
                error: "Missing required fields: otherUserType is required, otherUserId is optional for admin",
            });
            return;
        }
        // For admin chats, otherUserId can be null
        if (finalOtherUserType !== "admin" && !finalOtherUserId) {
            res.status(400).json({
                error: "otherUserId is required for non-admin chats",
            });
            return;
        }
        const normalizedUserRole = normalizeChatUserType(userRole);
        const normalizedOtherUserType = normalizeChatUserType(finalOtherUserType);
        if (!normalizedUserRole || !normalizedOtherUserType) {
            res.status(400).json({ error: "Invalid chat participant type" });
            return;
        }
        // Determine participant order - admin is always participant2 with potentially null ID
        let participant1Id, participant1Type, participant2Id, participant2Type;
        if (normalizedOtherUserType === "admin") {
            // Admin is always participant2 with potentially null ID
            participant1Id = userId;
            participant1Type = normalizedUserRole;
            participant2Id = null;
            participant2Type = normalizedOtherUserType;
        }
        else {
            // Regular ordering for non-admin participants
            // Ensure numeric comparison and normalize types so ordering is consistent
            const leftId = Number(userId);
            const rightId = Number(finalOtherUserId);
            const shouldSwap = leftId < rightId;
            if (shouldSwap) {
                participant1Id = userId;
                participant1Type = normalizedUserRole;
                participant2Id = finalOtherUserId;
                participant2Type = normalizedOtherUserType;
            }
            else {
                participant1Id = finalOtherUserId;
                participant1Type = normalizedOtherUserType;
                participant2Id = userId;
                participant2Type = normalizedUserRole;
            }
        }
        let chat = normalizedOtherUserType === "admin"
            ? yield (0, config_1.default)("chat")
                .where({
                participant1_user_id: participant1Id,
                participant2_user_type: participant2Type,
            })
                .first()
            : yield getExistingChatBetweenUsers(participant1Id, participant2Id);
        if (!chat) {
            const [chatId] = yield (0, config_1.default)("chat").insert({
                participant1_user_id: participant1Id,
                participant1_user_type: participant1Type,
                participant2_user_id: participant2Id,
                participant2_user_type: participant2Type,
                participant1_unread_count: 0,
                participant2_unread_count: 0,
            });
            chat = yield (0, config_1.default)("chat").where("id", chatId).first();
        }
        // Format response to match getChats response format
        const isParticipant1 = chat.participant1_user_id === userId;
        const otherParticipantId = isParticipant1
            ? chat.participant2_user_id
            : chat.participant1_user_id;
        const otherParticipantType = isParticipant1
            ? chat.participant2_user_type
            : chat.participant1_user_type;
        const otherParticipantDetails = yield getChatParticipantDetails(otherParticipantId);
        res.status(200).json({
            message: "Chat retrieved/created successfully",
            chat: {
                id: chat.id,
                otherParticipant: {
                    userId: otherParticipantId,
                    userType: (otherParticipantDetails === null || otherParticipantDetails === void 0 ? void 0 : otherParticipantDetails.role) ||
                        normalizeChatUserType(otherParticipantType),
                    email: otherParticipantDetails === null || otherParticipantDetails === void 0 ? void 0 : otherParticipantDetails.email,
                    name: otherParticipantDetails === null || otherParticipantDetails === void 0 ? void 0 : otherParticipantDetails.name,
                },
                unreadCount: isParticipant1
                    ? chat.participant1_unread_count
                    : chat.participant2_unread_count,
                lastMessage: null,
                createdAt: chat.created_at,
                updatedAt: chat.updated_at,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to get or create chat",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getOrCreateChat = getOrCreateChat;
const searchUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const searchValue = (_b = req.body.query) !== null && _b !== void 0 ? _b : req.body.email;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        if (typeof searchValue !== "string" || !searchValue.trim()) {
            res.status(400).json({ error: "A name or email is required" });
            return;
        }
        const normalizedSearch = searchValue.trim().toLowerCase();
        const likeSearch = `%${normalizedSearch}%`;
        const matches = yield (0, config_1.default)("users")
            .leftJoin("donors", "users.id", "donors.user_id")
            .leftJoin("organizations", "users.id", "organizations.user_id")
            .whereNot("users.id", userId)
            .whereRaw("LOWER(users.role) IN (?, ?, ?)", [
            "donor",
            "corporate",
            "ngo",
        ])
            .andWhere((builder) => {
            builder
                .whereRaw("LOWER(users.email) LIKE ?", [likeSearch])
                .orWhereRaw("LOWER(donors.name) LIKE ?", [likeSearch])
                .orWhereRaw("LOWER(organizations.name) LIKE ?", [likeSearch]);
        })
            .distinct("users.id", "users.email", "users.role", config_1.default.raw("COALESCE(organizations.name, donors.name) as name"))
            .orderByRaw("CASE WHEN LOWER(users.email) = ? OR LOWER(COALESCE(organizations.name, donors.name)) = ? THEN 0 ELSE 1 END", [normalizedSearch, normalizedSearch])
            .orderByRaw("COALESCE(organizations.name, donors.name) ASC")
            .limit(10);
        const users = matches.map((match) => {
            var _a;
            const role = (_a = match.role) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            return {
                id: match.id,
                email: match.email,
                name: match.name || null,
                role,
                userType: normalizeChatUserType(role),
            };
        });
        res.status(200).json({
            message: users.length > 0 ? "Users found" : "No users found",
            users,
            // Keep the previous response field while older clients use /search-donor.
            donor: users[0] || null,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to search for users",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.searchUsers = searchUsers;
const getChatMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { chatId } = req.params;
        if (!userId || !chatId) {
            res.status(400).json({ error: "Missing required parameters" });
            return;
        }
        // Verify user is a participant in this chat
        const chat = yield (0, config_1.default)("chat").where("id", chatId).first();
        if (!chat) {
            res.status(404).json({ error: "Chat not found" });
            return;
        }
        const isParticipant = chat.participant1_user_id === userId ||
            chat.participant2_user_id === userId;
        if (!isParticipant) {
            res.status(403).json({ error: "Unauthorized to access this chat" });
            return;
        }
        const messages = yield (0, config_1.default)("chat_message")
            .where("chat_id", chatId)
            .orderBy("created_at", "asc")
            .select("id", "sender_user_id", "sender_user_type", "message", "attachments", "status", "read_at", "created_at", "updated_at");
        res.status(200).json({
            message: "Messages fetched successfully",
            messages,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to fetch messages",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getChatMessages = getChatMessages;
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const { chatId } = req.params;
        const { message, attachments } = req.body;
        if (!userId || !userRole || !chatId || !message) {
            res.status(400).json({
                error: "Missing required fields: message is required",
            });
            return;
        }
        // Verify user is a participant in this chat
        const chat = yield (0, config_1.default)("chat").where("id", chatId).first();
        if (!chat) {
            res.status(404).json({ error: "Chat not found" });
            return;
        }
        const isParticipant1 = chat.participant1_user_id === userId;
        const isParticipant2 = chat.participant2_user_id === userId;
        if (!isParticipant1 && !isParticipant2) {
            res
                .status(403)
                .json({ error: "Unauthorized to send message in this chat" });
            return;
        }
        // Prepare attachments - only stringify if there's actual data
        let attachmentsData = null;
        if (attachments && Array.isArray(attachments) && attachments.length > 0) {
            attachmentsData = JSON.stringify(attachments);
        }
        const [messageId] = yield (0, config_1.default)("chat_message").insert({
            chat_id: chatId,
            sender_user_id: userId,
            sender_user_type: normalizeChatUserType(userRole),
            message: message.trim(),
            attachments: attachmentsData,
            status: "sent",
            created_at: new Date(),
            updated_at: new Date(),
        });
        if (!messageId) {
            throw new Error("Failed to insert message - no ID returned");
        }
        const otherParticipantField = isParticipant1
            ? "participant2_unread_count"
            : "participant1_unread_count";
        yield (0, config_1.default)("chat").where("id", chatId).increment(otherParticipantField, 1);
        // Get the inserted message
        const newMessage = yield (0, config_1.default)("chat_message").where("id", messageId).first();
        if (!newMessage) {
            throw new Error("Failed to retrieve inserted message");
        }
        // Safely parse attachments
        let parsedAttachments = null;
        if (newMessage.attachments) {
            try {
                parsedAttachments = JSON.parse(newMessage.attachments);
            }
            catch (parseError) {
                console.error("Error parsing attachments:", parseError);
                parsedAttachments = null;
            }
        }
        const messageData = {
            id: newMessage.id,
            chatId: newMessage.chat_id,
            senderUserId: newMessage.sender_user_id,
            senderUserType: newMessage.sender_user_type,
            message: newMessage.message,
            attachments: parsedAttachments,
            status: newMessage.status,
            createdAt: newMessage.created_at,
        };
        const recipientUserId = isParticipant1
            ? chat.participant2_user_id
            : chat.participant1_user_id;
        (0, chat_realtime_1.emitChatMessage)([recipientUserId], {
            type: "message",
            chatId,
            message: messageData,
        });
        res.status(201).json({
            message: "Message sent successfully",
            data: messageData,
        });
    }
    catch (error) {
        console.error("sendMessage error:", error);
        res.status(500).json({
            error: "Unable to send message",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.sendMessage = sendMessage;
const streamChatEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    (_b = res.flushHeaders) === null || _b === void 0 ? void 0 : _b.call(res);
    const removeClient = (0, chat_realtime_1.addChatRealtimeClient)(userId, res);
    const heartbeat = setInterval(() => {
        res.write(": heartbeat\n\n");
    }, 30000);
    req.on("close", () => {
        clearInterval(heartbeat);
        removeClient();
        res.end();
    });
});
exports.streamChatEvents = streamChatEvents;
const markMessageAsRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { messageId } = req.params;
        if (!userId || !messageId) {
            res.status(400).json({ error: "Missing required parameters" });
            return;
        }
        // Get the message
        const chatMessage = yield (0, config_1.default)("chat_message").where("id", messageId).first();
        if (!chatMessage) {
            res.status(404).json({ error: "Message not found" });
            return;
        }
        const chat = yield (0, config_1.default)("chat").where("id", chatMessage.chat_id).first();
        if (!chat) {
            res.status(404).json({ error: "Chat not found" });
            return;
        }
        const isParticipant = chat.participant1_user_id === userId ||
            chat.participant2_user_id === userId;
        if (!isParticipant) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }
        if (chatMessage.sender_user_id === userId) {
            res.status(400).json({ error: "Cannot mark own message as read" });
            return;
        }
        yield (0, config_1.default)("chat_message").where("id", messageId).update({
            status: "read",
            read_at: new Date(),
        });
        const isParticipant1 = chat.participant1_user_id === userId;
        const unreadField = isParticipant1
            ? "participant1_unread_count"
            : "participant2_unread_count";
        yield (0, config_1.default)("chat").where("id", chatMessage.chat_id).decrement(unreadField, 1);
        res.status(200).json({
            message: "Message marked as read",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to mark message as read",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.markMessageAsRead = markMessageAsRead;
const markChatAsRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { chatId } = req.params;
        if (!userId || !chatId) {
            res.status(400).json({ error: "Missing required parameters" });
            return;
        }
        // Verify user is a participant in this chat
        const chat = yield (0, config_1.default)("chat").where("id", chatId).first();
        if (!chat) {
            res.status(404).json({ error: "Chat not found" });
            return;
        }
        const isParticipant = chat.participant1_user_id === userId ||
            chat.participant2_user_id === userId;
        if (!isParticipant) {
            res.status(403).json({ error: "Unauthorized to access this chat" });
            return;
        }
        const otherParticipantId = chat.participant1_user_id === userId
            ? chat.participant2_user_id
            : chat.participant1_user_id;
        const [unreadCount] = yield (0, config_1.default)("chat_message")
            .where({
            chat_id: chatId,
            sender_user_id: otherParticipantId,
            status: "sent",
        })
            .count("id as total");
        yield (0, config_1.default)("chat_message")
            .where({
            chat_id: chatId,
            sender_user_id: otherParticipantId,
            status: "sent",
        })
            .update({
            status: "read",
            read_at: new Date(),
        });
        const unreadField = chat.participant1_user_id === userId
            ? "participant1_unread_count"
            : "participant2_unread_count";
        yield (0, config_1.default)("chat")
            .where("id", chatId)
            .update({ [unreadField]: 0 });
        res.status(200).json({
            message: "All messages marked as read",
            messagesMarkedAsRead: (unreadCount === null || unreadCount === void 0 ? void 0 : unreadCount.total) || 0,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to mark chat as read",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.markChatAsRead = markChatAsRead;
const deleteMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { messageId } = req.params;
        if (!userId || !messageId) {
            res.status(400).json({ error: "Missing required parameters" });
            return;
        }
        const chatMessage = yield (0, config_1.default)("chat_message").where("id", messageId).first();
        if (!chatMessage) {
            res.status(404).json({ error: "Message not found" });
            return;
        }
        if (chatMessage.sender_user_id !== userId) {
            res.status(403).json({ error: "You can only delete your own messages" });
            return;
        }
        yield (0, config_1.default)("chat_message").where("id", messageId).delete();
        res.status(200).json({
            message: "Message deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to delete message",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteMessage = deleteMessage;
const deleteChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { chatId } = req.params;
        if (!userId || !chatId) {
            res.status(400).json({ error: "Missing required parameters" });
            return;
        }
        // Verify user is a participant in this chat
        const chat = yield (0, config_1.default)("chat").where("id", chatId).first();
        if (!chat) {
            res.status(404).json({ error: "Chat not found" });
            return;
        }
        const isParticipant = chat.participant1_user_id === userId ||
            chat.participant2_user_id === userId;
        if (!isParticipant) {
            res.status(403).json({ error: "Unauthorized to delete this chat" });
            return;
        }
        yield (0, config_1.default)("chat_message").where("chat_id", chatId).delete();
        yield (0, config_1.default)("chat").where("id", chatId).delete();
        res.status(200).json({
            message: "Chat deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Unable to delete chat",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteChat = deleteChat;

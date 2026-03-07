import { NextFunction, Response } from "express";
import db from "../../config";
import { User, UserRequest } from "../../interfaces";

export const getChats = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const userRole = (req.user as User)?.role;

    if (!userId || !userRole) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const chats = await db("chat")
      .where("participant1_user_id", userId)
      .orWhere("participant2_user_id", userId);

    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const isParticipant1 = chat.participant1_user_id === userId;

        const senderUserId = isParticipant1
          ? chat.participant2_user_id
          : chat.participant1_user_id;

        const unreadMessages = await db("chat_message")
          .where({
            chat_id: chat.id,
            sender_user_id: senderUserId,
            status: "sent",
          })
          .count("id as count")
          .first();

        const unreadCount = unreadMessages?.count || 0;

        const updateField = isParticipant1
          ? "participant1_unread_count"
          : "participant2_unread_count";

        await db("chat")
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
          ? await db("users")
              .where("id", otherParticipantId)
              .select("id", "email")
              .first()
          : null;

        const lastMessage = await db("chat_message")
          .where("chat_id", chat.id)
          .orderBy("created_at", "desc")
          .select("id", "message", "sender_user_id", "created_at", "status")
          .first();

        return {
          id: chat.id,
          otherParticipant: {
            userId: otherParticipantId,
            userType: otherParticipantType,
            email: otherParticipant?.email,
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
      })
    );

    enrichedChats.sort(
      (a, b) =>
        new Date(b.lastMessage?.timestamp || b.updatedAt).getTime() -
        new Date(a.lastMessage?.timestamp || a.updatedAt).getTime()
    );

    res.status(200).json({
      message: "Chats fetched successfully",
      chats: enrichedChats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to fetch chats",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getOrCreateChat = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const userRole = (req.user as User)?.role;
    const { otherUserId, otherUserType } = req.body;

    if (!userId || !userRole || !otherUserType) {
      res.status(400).json({
        error:
          "Missing required fields: otherUserType is required, otherUserId is optional for admin",
      });
      return;
    }

    // For admin chats, otherUserId can be null
    if (otherUserType !== "admin" && !otherUserId) {
      res.status(400).json({
        error: "otherUserId is required for non-admin chats",
      });
      return;
    }

    // Determine participant order - admin is always participant2 with potentially null ID
    let participant1Id, participant1Type, participant2Id, participant2Type;

    if (otherUserType === "admin") {
      // Admin is always participant2 with potentially null ID
      participant1Id = userId;
      participant1Type = userRole;
      participant2Id = null;
      participant2Type = otherUserType;
    } else {
      // Regular ordering for non-admin participants
      const shouldSwap = userId < otherUserId;
      if (shouldSwap) {
        participant1Id = userId;
        participant1Type = userRole;
        participant2Id = otherUserId;
        participant2Type = otherUserType;
      } else {
        participant1Id = otherUserId;
        participant1Type = otherUserType;
        participant2Id = userId;
        participant2Type = userRole;
      }
    }

    let chat = await db("chat")
      .where({
        participant1_user_id: participant1Id,
        participant2_user_id: participant2Id,
      })
      .first();

    if (!chat) {
      const [chatId] = await db("chat").insert({
        participant1_user_id: participant1Id,
        participant1_user_type: participant1Type,
        participant2_user_id: participant2Id,
        participant2_user_type: participant2Type,
        participant1_unread_count: 0,
        participant2_unread_count: 0,
      });

      chat = await db("chat").where("id", chatId).first();
    }

    res.status(200).json({
      message: "Chat retrieved/created successfully",
      chat: {
        id: chat.id,
        participant1: {
          userId: chat.participant1_user_id,
          userType: chat.participant1_user_type,
        },
        participant2: {
          userId: chat.participant2_user_id,
          userType: chat.participant2_user_type,
        },
        unreadCounts: {
          participant1: chat.participant1_unread_count,
          participant2: chat.participant2_unread_count,
        },
        createdAt: chat.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to get or create chat",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getChatMessages = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    if (!userId || !chatId) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    // Verify user is a participant in this chat
    const chat = await db("chat").where("id", chatId).first();

    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const isParticipant =
      chat.participant1_user_id === userId ||
      chat.participant2_user_id === userId;

    if (!isParticipant) {
      res.status(403).json({ error: "Unauthorized to access this chat" });
      return;
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 50;
    const offset = (pageNum - 1) * limitNum;

    const [totalCount] = await db("chat_message")
      .where("chat_id", chatId)
      .count("id as total");

    const total = Number(totalCount?.total) || 0;
    const totalPages = Math.ceil(total / limitNum);

    const messages = await db("chat_message")
      .where("chat_id", chatId)
      .orderBy("created_at", "asc")
      .limit(limitNum)
      .offset(offset)
      .select(
        "id",
        "sender_user_id",
        "sender_user_type",
        "message",
        "attachments",
        "status",
        "read_at",
        "created_at",
        "updated_at"
      );

    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalMessages: total,
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to fetch messages",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const sendMessage = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const userRole = (req.user as User)?.role;
    const { chatId } = req.params;
    const { message, attachments } = req.body;

    if (!userId || !userRole || !chatId || !message) {
      res.status(400).json({
        error: "Missing required fields: message is required",
      });
      return;
    }

    // Verify user is a participant in this chat
    const chat = await db("chat").where("id", chatId).first();

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

    const [messageId] = await db("chat_message").insert({
      chat_id: chatId,
      sender_user_id: userId,
      sender_user_type: userRole,
      message,
      attachments: attachments ? JSON.stringify(attachments) : null,
      status: "sent",
    });

    const otherParticipantField = isParticipant1
      ? "participant2_unread_count"
      : "participant1_unread_count";

    await db("chat").where("id", chatId).increment(otherParticipantField, 1);

    // Get the inserted message
    const newMessage = await db("chat_message").where("id", messageId).first();

    res.status(201).json({
      message: "Message sent successfully",
      data: {
        id: newMessage.id,
        chatId: newMessage.chat_id,
        senderUserId: newMessage.sender_user_id,
        senderUserType: newMessage.sender_user_type,
        message: newMessage.message,
        attachments: newMessage.attachments
          ? JSON.parse(newMessage.attachments)
          : null,
        status: newMessage.status,
        createdAt: newMessage.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to send message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const markMessageAsRead = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const { messageId } = req.params;

    if (!userId || !messageId) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    // Get the message
    const chatMessage = await db("chat_message").where("id", messageId).first();

    if (!chatMessage) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    const chat = await db("chat").where("id", chatMessage.chat_id).first();

    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const isParticipant =
      chat.participant1_user_id === userId ||
      chat.participant2_user_id === userId;

    if (!isParticipant) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    if (chatMessage.sender_user_id === userId) {
      res.status(400).json({ error: "Cannot mark own message as read" });
      return;
    }

    await db("chat_message").where("id", messageId).update({
      status: "read",
      read_at: new Date(),
    });

    const isParticipant1 = chat.participant1_user_id === userId;
    const unreadField = isParticipant1
      ? "participant1_unread_count"
      : "participant2_unread_count";

    await db("chat").where("id", chatMessage.chat_id).decrement(unreadField, 1);

    res.status(200).json({
      message: "Message marked as read",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to mark message as read",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const markChatAsRead = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const { chatId } = req.params;

    if (!userId || !chatId) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    // Verify user is a participant in this chat
    const chat = await db("chat").where("id", chatId).first();

    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const isParticipant =
      chat.participant1_user_id === userId ||
      chat.participant2_user_id === userId;

    if (!isParticipant) {
      res.status(403).json({ error: "Unauthorized to access this chat" });
      return;
    }

    const otherParticipantId =
      chat.participant1_user_id === userId
        ? chat.participant2_user_id
        : chat.participant1_user_id;

    const [unreadCount] = await db("chat_message")
      .where({
        chat_id: chatId,
        sender_user_id: otherParticipantId,
        status: "sent",
      })
      .count("id as total");

    await db("chat_message")
      .where({
        chat_id: chatId,
        sender_user_id: otherParticipantId,
        status: "sent",
      })
      .update({
        status: "read",
        read_at: new Date(),
      });

    const unreadField =
      chat.participant1_user_id === userId
        ? "participant1_unread_count"
        : "participant2_unread_count";

    await db("chat")
      .where("id", chatId)
      .update({ [unreadField]: 0 });

    res.status(200).json({
      message: "All messages marked as read",
      messagesMarkedAsRead: unreadCount?.total || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to mark chat as read",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteMessage = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const { messageId } = req.params;

    if (!userId || !messageId) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    const chatMessage = await db("chat_message").where("id", messageId).first();

    if (!chatMessage) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    if (chatMessage.sender_user_id !== userId) {
      res.status(403).json({ error: "You can only delete your own messages" });
      return;
    }

    await db("chat_message").where("id", messageId).delete();

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to delete message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteChat = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const { chatId } = req.params;

    if (!userId || !chatId) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    // Verify user is a participant in this chat
    const chat = await db("chat").where("id", chatId).first();

    if (!chat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    const isParticipant =
      chat.participant1_user_id === userId ||
      chat.participant2_user_id === userId;

    if (!isParticipant) {
      res.status(403).json({ error: "Unauthorized to delete this chat" });
      return;
    }

    await db("chat_message").where("chat_id", chatId).delete();

    await db("chat").where("id", chatId).delete();

    res.status(200).json({
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to delete chat",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

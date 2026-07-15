import { NextFunction, Response } from "express";
import db from "../../config";
import { User, UserRequest } from "../../interfaces";
import { addChatRealtimeClient, emitChatMessage } from "./chat.realtime";

const normalizeChatUserType = (userType?: string | null): string | null => {
  if (!userType) {
    return null;
  }

  const normalized = userType.toLowerCase();
  return normalized === "corporate" ? "donor" : normalized;
};

const getChatParticipantDetails = async (
  userId: number | string | null,
) => {
  if (!userId) {
    return null;
  }

  const user = await db("users")
    .where("id", userId)
    .select("id", "email", "role")
    .first();

  if (!user) {
    return null;
  }

  const normalizedRole = user.role?.toLowerCase();
  const profile =
    normalizedRole === "ngo"
      ? await db("organizations")
          .where("user_id", userId)
          .select("name")
          .first()
      : await db("donors")
          .where("user_id", userId)
          .select("name")
          .first();

  return {
    id: user.id,
    email: user.email,
    name: profile?.name || null,
    role: normalizedRole,
  };
};

const getExistingChatBetweenUsers = async (
  firstUserId: number | string | null,
  secondUserId: number | string | null,
) => {
  if (!firstUserId || !secondUserId) {
    return null;
  }

  return db("chat")
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
};

export const getChats = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
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
          ? await getChatParticipantDetails(otherParticipantId)
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
            userType:
              otherParticipant?.role ||
              normalizeChatUserType(otherParticipantType),
            email: otherParticipant?.email,
            name: otherParticipant?.name,
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
      }),
    );

    enrichedChats.sort(
      (a, b) =>
        new Date(b.lastMessage?.timestamp || b.updatedAt).getTime() -
        new Date(a.lastMessage?.timestamp || a.updatedAt).getTime(),
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
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const userRole = (req.user as User)?.role;
    const { otherUserId, otherUserType, otherParticipant } = req.body;

    // Support both flat structure and nested otherParticipant structure
    const finalOtherUserId = otherUserId || otherParticipant?.userId || null;
    const finalOtherUserType = otherUserType || otherParticipant?.userType;

    if (!userId || !userRole || !finalOtherUserType) {
      res.status(400).json({
        error:
          "Missing required fields: otherUserType is required, otherUserId is optional for admin",
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
    } else {
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
      } else {
        participant1Id = finalOtherUserId;
        participant1Type = normalizedOtherUserType;
        participant2Id = userId;
        participant2Type = normalizedUserRole;
      }
    }

    let chat =
      normalizedOtherUserType === "admin"
        ? await db("chat")
            .where({
              participant1_user_id: participant1Id,
              participant2_user_type: participant2Type,
            })
            .first()
        : await getExistingChatBetweenUsers(participant1Id, participant2Id);

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

    // Format response to match getChats response format
    const isParticipant1 = chat.participant1_user_id === userId;
    const otherParticipantId = isParticipant1
      ? chat.participant2_user_id
      : chat.participant1_user_id;
    const otherParticipantType = isParticipant1
      ? chat.participant2_user_type
      : chat.participant1_user_type;
    const otherParticipantDetails = await getChatParticipantDetails(
      otherParticipantId,
    );

    res.status(200).json({
      message: "Chat retrieved/created successfully",
      chat: {
        id: chat.id,
        otherParticipant: {
          userId: otherParticipantId,
          userType:
            otherParticipantDetails?.role ||
            normalizeChatUserType(otherParticipantType),
          email: otherParticipantDetails?.email,
          name: otherParticipantDetails?.name,
        },
        unreadCount: isParticipant1
          ? chat.participant1_unread_count
          : chat.participant2_unread_count,
        lastMessage: null,
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
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

export const searchUsers = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req.user as User)?.id;
    const searchValue = req.body.query ?? req.body.email;

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

    const matches = await db("users")
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
      .distinct(
        "users.id",
        "users.email",
        "users.role",
        db.raw("COALESCE(organizations.name, donors.name) as name"),
      )
      .orderByRaw(
        "CASE WHEN LOWER(users.email) = ? OR LOWER(COALESCE(organizations.name, donors.name)) = ? THEN 0 ELSE 1 END",
        [normalizedSearch, normalizedSearch],
      )
      .orderByRaw("COALESCE(organizations.name, donors.name) ASC")
      .limit(10);

    const users = matches.map((match) => {
      const role = match.role?.toLowerCase();

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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Unable to search for users",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getChatMessages = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
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

    const messages = await db("chat_message")
      .where("chat_id", chatId)
      .orderBy("created_at", "asc")
      .select(
        "id",
        "sender_user_id",
        "sender_user_type",
        "message",
        "attachments",
        "status",
        "read_at",
        "created_at",
        "updated_at",
      );

    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
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
  next: NextFunction,
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

    // Prepare attachments - only stringify if there's actual data
    let attachmentsData = null;
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      attachmentsData = JSON.stringify(attachments);
    }

    const [messageId] = await db("chat_message").insert({
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

    await db("chat").where("id", chatId).increment(otherParticipantField, 1);

    // Get the inserted message
    const newMessage = await db("chat_message").where("id", messageId).first();

    if (!newMessage) {
      throw new Error("Failed to retrieve inserted message");
    }

    // Safely parse attachments
    let parsedAttachments = null;
    if (newMessage.attachments) {
      try {
        parsedAttachments = JSON.parse(newMessage.attachments);
      } catch (parseError) {
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

    emitChatMessage([recipientUserId], {
      type: "message",
      chatId,
      message: messageData,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: messageData,
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({
      error: "Unable to send message",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const streamChatEvents = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = (req.user as User)?.id;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const removeClient = addChatRealtimeClient(userId, res);
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 30000);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeClient();
    res.end();
  });
};

export const markMessageAsRead = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
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
  next: NextFunction,
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
  next: NextFunction,
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
  next: NextFunction,
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

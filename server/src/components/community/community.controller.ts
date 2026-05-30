import { Request, Response } from "express";
import db from "../../config";

// Fetch messages for a project
export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const totalCount = await db("community")
      .where("project_id", id)
      .count()
      .first();
    const totalItems = parseInt(String(totalCount?.["count(*)"]) || "0");

    const totalPages = Math.ceil(totalItems / limit);

    const messages = await db("community")
      .where("project_id", id)
      .select(
        "id",
        "messages",
        "name",
        "phone",
        "likes",
        "reactions",
        "createdAt"
      )
      .limit(limit)
      .offset(offset);

    res.status(200).json({
      totalItems,
      totalPages,
      currentPage: page,
      messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch messages" });
  }
};

// Increment likes for a message
export const likeMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const messageId = req.params.id;
    await db("community").where("id", messageId).increment("likes", 1);
    res.status(200).json({ message: "Likes increased successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to increase likes" });
  }
};

// Increment reactions for a message
export const reactToMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const messageId = req.params.id;
    await db("community").where("id", messageId).increment("reactions", 1);
    res.status(200).json({ message: "Reactions increased successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to increase reactions" });
  }
};

// Add a new message
export const addMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, message, phone } = req.body;
    const projectId = req.params.id;

    const missingFields: string[] = [];
    if (!projectId) missingFields.push("projectId");
    if (!name) missingFields.push("name");
    if (!message) missingFields.push("message");

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

    const [insertedMessage] = await db("community")
      .insert(newMessage)
      .returning("*");

    res.status(201).json({
      message: "Message added successfully",
      insertedMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to add a new message" });
  }
};

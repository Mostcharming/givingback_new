import { NextFunction, Response } from "express";
import db from "../config";
import { UserRequest } from "../interfaces";
import { CreateNotificationDTO } from "../interfaces/notifications-calendar.interface";

/**
 * Middleware to save notifications
 * Usage: Call this anywhere in your code to save a notification for a user
 *
 * Example:
 * await saveNotification(user_id, {
 *   icon_type: 'deposit',
 *   amount: 100,
 *   action: 'Project Funded',
 *   target: 'Project Name',
 *   status: 'success'
 * })
 */
export const saveNotification = async (
  userId: number,
  notificationData: Omit<CreateNotificationDTO, "user_id">,
): Promise<void> => {
  try {
    await db("notifications").insert({
      user_id: userId,
      ...notificationData,
    });
    console.log(`Notification saved for user ${userId}`);
  } catch (error) {
    console.error("Error saving notification:", error);
    throw error;
  }
};

/**
 * Middleware to save multiple notifications at once
 * Useful for bulk operations like disbursing funds to multiple projects
 */
export const saveMultipleNotifications = async (
  notifications: Array<{
    user_id: number;
    icon_type: "deposit" | "withdrawal" | "info";
    amount: number;
    action: string;
    target: string;
    status: string;
  }>,
): Promise<void> => {
  try {
    await db("notifications").insert(notifications);
    console.log(`${notifications.length} notifications saved`);
  } catch (error) {
    console.error("Error saving multiple notifications:", error);
    throw error;
  }
};

/**
 * Express middleware to attach saveNotification function to request object
 * Usage: app.use(notificationMiddleware)
 */
export const notificationMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  req.saveNotification = saveNotification;
  req.saveMultipleNotifications = saveMultipleNotifications;
  next();
};

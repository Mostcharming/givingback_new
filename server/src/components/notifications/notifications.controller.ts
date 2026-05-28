import { NextFunction, Response } from "express";
import db from "../../config";
import { User, UserRequest } from "../../interfaces";

/**
 * Get all notifications for NGO
 */
export const getNGONotifications = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id;

    // Verify user is NGO
    const ngo = await db("ngos").where({ user_id: userId }).first();
    if (!ngo) {
      return res
        .status(403)
        .json({ status: "fail", message: "User is not an NGO" });
    }

    const notifications = await db("notifications")
      .where({ user_id: userId })
      .orderBy("created_at", "desc")
      .limit(50);

    res.status(200).json({
      status: "success",
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Error fetching notifications" });
  }
};

/**
 * Get all notifications for Donor/Corporate
 */
export const getDonorCorporateNotifications = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id;

    // Check if user is donor or corporate
    const donor = await db("donors").where({ user_id: userId }).first();
    const organization = await db("organizations").where({ user_id: userId }).first();

    if (!donor && !organization) {
      return res
        .status(403)
        .json({
          status: "fail",
          message: "User is neither a donor nor corporate organization",
        });
    }

    const notifications = await db("notifications")
      .where({ user_id: userId })
      .orderBy("created_at", "desc")
      .limit(50);

    res.status(200).json({
      status: "success",
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Error fetching notifications" });
  }
};

/**
 * Get all notifications for Admin
 */
export const getAdminNotifications = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id;

    // Verify user is admin
    const admin = await db("admins").where({ user_id: userId }).first();
    if (!admin) {
      return res
        .status(403)
        .json({ status: "fail", message: "User is not an admin" });
    }

    const notifications = await db("notifications")
      .where({ user_id: userId })
      .orderBy("created_at", "desc")
      .limit(50);

    res.status(200).json({
      status: "success",
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Error fetching notifications" });
  }
};

/**
 * Mark notification as read (if you add a read column)
 */
export const markNotificationAsRead = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = (req.user as User)?.id;

    const notification = await db("notifications")
      .where({ id, user_id: userId })
      .first();

    if (!notification) {
      return res
        .status(404)
        .json({ status: "fail", message: "Notification not found" });
    }

    await db("notifications").where({ id }).update({
      status: "read",
      updated_at: new Date(),
    });

    res.status(200).json({
      status: "success",
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Error updating notification" });
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = (req.user as User)?.id;

    const notification = await db("notifications")
      .where({ id, user_id: userId })
      .first();

    if (!notification) {
      return res
        .status(404)
        .json({ status: "fail", message: "Notification not found" });
    }

    await db("notifications").where({ id }).del();

    res.status(200).json({
      status: "success",
      message: "Notification deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Error deleting notification" });
  }
};

/**
 * Clear all notifications for user
 */
export const clearAllNotifications = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as User)?.id;

    await db("notifications").where({ user_id: userId }).del();

    res.status(200).json({
      status: "success",
      message: "All notifications cleared",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "fail", message: "Error clearing notifications" });
  }
};

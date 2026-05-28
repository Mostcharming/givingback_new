import express from "express";
import { secureLogin } from "../../middleware/auth";
import {
  clearAllNotifications,
  deleteNotification,
  getAdminNotifications,
  getDonorCorporateNotifications,
  getNGONotifications,
  markNotificationAsRead,
} from "./notifications.controller";

const router = express.Router();

// NGO notifications routes
router.get("/ngo/notifications", secureLogin, getNGONotifications as any);

// Donor/Corporate notifications routes
router.get(
  "/donor-corporate/notifications",
  secureLogin,
  getDonorCorporateNotifications as any,
);

// Admin notifications routes
router.get("/admin/notifications", secureLogin, getAdminNotifications as any);

// Common notification actions
router.put(
  "/notifications/:id/read",
  secureLogin,
  markNotificationAsRead as any,
);
router.delete("/notifications/:id", secureLogin, deleteNotification as any);
router.delete("/notifications", secureLogin, clearAllNotifications as any);

export default router;

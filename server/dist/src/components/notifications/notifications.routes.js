"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const notifications_controller_1 = require("./notifications.controller");
const router = express_1.default.Router();
// NGO notifications routes
router.get("/ngo/notifications", auth_1.secureLogin, notifications_controller_1.getNGONotifications);
// Donor/Corporate notifications routes
router.get("/donor-corporate/notifications", auth_1.secureLogin, notifications_controller_1.getDonorCorporateNotifications);
// Admin notifications routes
router.get("/admin/notifications", auth_1.secureLogin, notifications_controller_1.getAdminNotifications);
// Common notification actions
router.put("/notifications/:id/read", auth_1.secureLogin, notifications_controller_1.markNotificationAsRead);
router.delete("/notifications/:id", auth_1.secureLogin, notifications_controller_1.deleteNotification);
router.delete("/notifications", auth_1.secureLogin, notifications_controller_1.clearAllNotifications);
exports.default = router;

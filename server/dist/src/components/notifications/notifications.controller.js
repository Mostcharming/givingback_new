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
exports.clearAllNotifications = exports.deleteNotification = exports.markNotificationAsRead = exports.getAdminNotifications = exports.getDonorCorporateNotifications = exports.getNGONotifications = void 0;
const config_1 = __importDefault(require("../../config"));
/**
 * Get all notifications for NGO
 */
const getNGONotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Verify user is NGO
        const ngo = yield (0, config_1.default)("organizations").where({ user_id: userId }).first();
        if (!ngo) {
            return res
                .status(403)
                .json({ status: "fail", message: "User is not an NGO" });
        }
        const notifications = yield (0, config_1.default)("notifications")
            .where({ user_id: userId })
            .orderBy("created_at", "desc")
            .limit(50);
        res.status(200).json({
            status: "success",
            data: notifications,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error fetching notifications" });
    }
});
exports.getNGONotifications = getNGONotifications;
/**
 * Get all notifications for Donor/Corporate
 */
const getDonorCorporateNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Check if user is donor or corporate
        const donor = yield (0, config_1.default)("donors").where({ user_id: userId }).first();
        const organization = yield (0, config_1.default)("organizations")
            .where({ user_id: userId })
            .first();
        if (!donor && !organization) {
            return res.status(403).json({
                status: "fail",
                message: "User is neither a donor nor corporate organization",
            });
        }
        const notifications = yield (0, config_1.default)("notifications")
            .where({ user_id: userId })
            .orderBy("created_at", "desc")
            .limit(50);
        res.status(200).json({
            status: "success",
            data: notifications,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error fetching notifications" });
    }
});
exports.getDonorCorporateNotifications = getDonorCorporateNotifications;
/**
 * Get all notifications for Admin
 */
const getAdminNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Verify user is admin
        const admin = yield (0, config_1.default)("admins").where({ user_id: userId }).first();
        if (!admin) {
            return res
                .status(403)
                .json({ status: "fail", message: "User is not an admin" });
        }
        const notifications = yield (0, config_1.default)("notifications")
            .where({ user_id: userId })
            .orderBy("created_at", "desc")
            .limit(50);
        res.status(200).json({
            status: "success",
            data: notifications,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error fetching notifications" });
    }
});
exports.getAdminNotifications = getAdminNotifications;
/**
 * Mark notification as read (if you add a read column)
 */
const markNotificationAsRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const notification = yield (0, config_1.default)("notifications")
            .where({ id, user_id: userId })
            .first();
        if (!notification) {
            return res
                .status(404)
                .json({ status: "fail", message: "Notification not found" });
        }
        yield (0, config_1.default)("notifications").where({ id }).update({
            status: "read",
            updated_at: new Date(),
        });
        res.status(200).json({
            status: "success",
            message: "Notification marked as read",
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error updating notification" });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
/**
 * Delete notification
 */
const deleteNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const notification = yield (0, config_1.default)("notifications")
            .where({ id, user_id: userId })
            .first();
        if (!notification) {
            return res
                .status(404)
                .json({ status: "fail", message: "Notification not found" });
        }
        yield (0, config_1.default)("notifications").where({ id }).del();
        res.status(200).json({
            status: "success",
            message: "Notification deleted",
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error deleting notification" });
    }
});
exports.deleteNotification = deleteNotification;
/**
 * Clear all notifications for user
 */
const clearAllNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        yield (0, config_1.default)("notifications").where({ user_id: userId }).del();
        res.status(200).json({
            status: "success",
            message: "All notifications cleared",
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error clearing notifications" });
    }
});
exports.clearAllNotifications = clearAllNotifications;

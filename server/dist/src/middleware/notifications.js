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
exports.notificationMiddleware = exports.saveMultipleNotifications = exports.saveNotification = void 0;
const config_1 = __importDefault(require("../config"));
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
const saveNotification = (userId, notificationData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, config_1.default)("notifications").insert(Object.assign({ user_id: userId }, notificationData));
        console.log(`Notification saved for user ${userId}`);
    }
    catch (error) {
        console.error("Error saving notification:", error);
        throw error;
    }
});
exports.saveNotification = saveNotification;
/**
 * Middleware to save multiple notifications at once
 * Useful for bulk operations like disbursing funds to multiple projects
 */
const saveMultipleNotifications = (notifications) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, config_1.default)("notifications").insert(notifications);
        console.log(`${notifications.length} notifications saved`);
    }
    catch (error) {
        console.error("Error saving multiple notifications:", error);
        throw error;
    }
});
exports.saveMultipleNotifications = saveMultipleNotifications;
/**
 * Express middleware to attach saveNotification function to request object
 * Usage: app.use(notificationMiddleware)
 */
const notificationMiddleware = (req, res, next) => {
    req.saveNotification = exports.saveNotification;
    req.saveMultipleNotifications = exports.saveMultipleNotifications;
    next();
};
exports.notificationMiddleware = notificationMiddleware;

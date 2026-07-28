"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const calendar_controller_1 = require("./calendar.controller");
const router = express_1.default.Router();
// Calendar event routes (NGO only)
router
    .route("/events")
    .post(auth_1.secureLogin, calendar_controller_1.createCalendarEvent)
    .get(auth_1.secureLogin, calendar_controller_1.getCalendarEvents);
router
    .route("/events/:id")
    .get(auth_1.secureLogin, calendar_controller_1.getCalendarEventById)
    .put(auth_1.secureLogin, calendar_controller_1.updateCalendarEvent)
    .delete(auth_1.secureLogin, calendar_controller_1.deleteCalendarEvent);
router.get("/projects/:projectId/events", auth_1.secureLogin, calendar_controller_1.getCalendarEventsByProject);
exports.default = router;

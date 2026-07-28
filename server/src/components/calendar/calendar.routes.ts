import express from "express";
import { secureLogin } from "../../middleware/auth";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEventById,
  getCalendarEvents,
  getCalendarEventsByProject,
  updateCalendarEvent,
} from "./calendar.controller";

const router = express.Router();

// Calendar event routes (NGO only)
router
  .route("/events")
  .post(secureLogin, createCalendarEvent as any)
  .get(secureLogin, getCalendarEvents as any);

router
  .route("/events/:id")
  .get(secureLogin, getCalendarEventById as any)
  .put(secureLogin, updateCalendarEvent as any)
  .delete(secureLogin, deleteCalendarEvent as any);

router.get(
  "/projects/:projectId/events",
  secureLogin,
  getCalendarEventsByProject as any,
);

export default router;

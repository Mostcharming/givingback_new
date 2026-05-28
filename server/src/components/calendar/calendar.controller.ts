import { NextFunction, Response } from "express";
import db from "../../config";
import { User, UserRequest } from "../../interfaces";
import {
  CreateCalendarEventDTO,
  UpdateCalendarEventDTO,
} from "../../interfaces/notifications-calendar.interface";

/**
 * Create calendar event (NGO only)
 */
export const createCalendarEvent = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as User)?.id;
    const {
      title,
      description,
      start_time,
      end_time,
      event_type,
      location,
      attendees,
      project_id,
    } = req.body;

    // Verify user is NGO
    const ngo = await db("ngos").where({ user_id: userId }).first();
    if (!ngo) {
      return res
        .status(403)
        .json({
          status: "fail",
          message: "Only NGOs can create calendar events",
        });
    }

    // Validate required fields
    if (!title || !start_time || !end_time) {
      return res.status(400).json({
        status: "fail",
        message: "Title, start_time, and end_time are required",
      });
    }

    // Validate date range
    if (new Date(start_time) >= new Date(end_time)) {
      return res.status(400).json({
        status: "fail",
        message: "end_time must be after start_time",
      });
    }

    const eventData: CreateCalendarEventDTO = {
      user_id: userId,
      title,
      description: description || null,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      event_type: event_type || "other",
      location: location || null,
      attendees: attendees || null,
      project_id: project_id || null,
    };

    const [eventId] = await db("calendar_events").insert(eventData);

    const event = await db("calendar_events").where({ id: eventId }).first();

    res.status(201).json({
      status: "success",
      message: "Calendar event created successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "fail", message: "Error creating calendar event" });
  }
};

/**
 * Get all calendar events for NGO
 */
export const getCalendarEvents = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as User)?.id;
    const { start_date, end_date, event_type } = req.query;

    // Verify user is NGO
    const ngo = await db("ngos").where({ user_id: userId }).first();
    if (!ngo) {
      return res
        .status(403)
        .json({
          status: "fail",
          message: "Only NGOs can view calendar events",
        });
    }

    let query = db("calendar_events").where({ user_id: userId });

    // Filter by date range if provided
    if (start_date) {
      query = query.where("start_time", ">=", new Date(start_date as string));
    }
    if (end_date) {
      query = query.where("end_time", "<=", new Date(end_date as string));
    }

    // Filter by event type if provided
    if (event_type) {
      query = query.where("event_type", event_type);
    }

    const events = await query.orderBy("start_time", "asc");

    res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "fail", message: "Error fetching calendar events" });
  }
};

/**
 * Get single calendar event by ID (NGO only)
 */
export const getCalendarEventById = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as User)?.id;
    const { id } = req.params;

    // Verify user is NGO
    const ngo = await db("ngos").where({ user_id: userId }).first();
    if (!ngo) {
      return res
        .status(403)
        .json({
          status: "fail",
          message: "Only NGOs can view calendar events",
        });
    }

    const event = await db("calendar_events")
      .where({ id, user_id: userId })
      .first();

    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "Calendar event not found" });
    }

    res.status(200).json({
      status: "success",
      data: event,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "fail", message: "Error fetching calendar event" });
  }
};

/**
 * Update calendar event (NGO only)
 */
export const updateCalendarEvent = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as User)?.id;
    const { id } = req.params;
    const { title, description, start_time, end_time, event_type, location, attendees } = req.body;
    
    const updateData: UpdateCalendarEventDTO = {
      ...(title && { title }),
      ...(description && { description }),
      ...(start_time && { start_time: new Date(start_time) }),
      ...(end_time && { end_time: new Date(end_time) }),
      ...(event_type && { event_type }),
      ...(location && { location }),
      ...(attendees && { attendees }),
    };

    // Verify user is NGO
    const ngo = await db("ngos").where({ user_id: userId }).first();
    if (!ngo) {
      return res
        .status(403)
        .json({
          status: "fail",
          message: "Only NGOs can update calendar events",
        });
    }

    // Check if event exists and belongs to user
    const event = await db("calendar_events")
      .where({ id, user_id: userId })
      .first();

    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "Calendar event not found" });
    }

    // Validate date range if both dates are provided
    if (updateData.start_time && updateData.end_time) {
      if (new Date(updateData.start_time) >= new Date(updateData.end_time)) {
        return res.status(400).json({
          status: "fail",
          message: "end_time must be after start_time",
        });
      }
    }

    // Prepare update data
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date(),
    };

    // Convert date strings to Date objects if they exist
    if (updateData.start_time) {
      dataToUpdate.start_time = new Date(updateData.start_time);
    }
    if (updateData.end_time) {
      dataToUpdate.end_time = new Date(updateData.end_time);
    }

    await db("calendar_events").where({ id }).update(dataToUpdate);

    const updatedEvent = await db("calendar_events").where({ id }).first();

    res.status(200).json({
      status: "success",
      message: "Calendar event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "fail", message: "Error updating calendar event" });
  }
};

/**
 * Delete calendar event (NGO only)
 */
export const deleteCalendarEvent = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as User)?.id;
    const { id } = req.params;

    // Verify user is NGO
    const ngo = await db("ngos").where({ user_id: userId }).first();
    if (!ngo) {
      return res
        .status(403)
        .json({
          status: "fail",
          message: "Only NGOs can delete calendar events",
        });
    }

    // Check if event exists and belongs to user
    const event = await db("calendar_events")
      .where({ id, user_id: userId })
      .first();

    if (!event) {
      return res
        .status(404)
        .json({ status: "fail", message: "Calendar event not found" });
    }

    await db("calendar_events").where({ id }).del();

    res.status(200).json({
      status: "success",
      message: "Calendar event deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "fail", message: "Error deleting calendar event" });
  }
};

/**
 * Get calendar events by project ID (NGO only)
 */
export const getCalendarEventsByProject = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as User)?.id;
    const { projectId } = req.params;

    // Verify user is NGO
    const ngo = await db("ngos").where({ user_id: userId }).first();
    if (!ngo) {
      return res
        .status(403)
        .json({
          status: "fail",
          message: "Only NGOs can view calendar events",
        });
    }

    const events = await db("calendar_events")
      .where({ user_id: userId, project_id: projectId })
      .orderBy("start_time", "asc");

    res.status(200).json({
      status: "success",
      data: events,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "fail", message: "Error fetching calendar events" });
  }
};

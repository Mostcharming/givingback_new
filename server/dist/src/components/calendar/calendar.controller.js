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
exports.getCalendarEventsByProject = exports.deleteCalendarEvent = exports.updateCalendarEvent = exports.getCalendarEventById = exports.getCalendarEvents = exports.createCalendarEvent = void 0;
const config_1 = __importDefault(require("../../config"));
/**
 * Create calendar event (NGO only)
 */
const createCalendarEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { title, description, start_time, end_time, event_type, location, attendees, project_id, } = req.body;
        // Verify user is NGO
        const ngo = yield (0, config_1.default)("organizations").where({ user_id: userId }).first();
        if (!ngo) {
            return res.status(403).json({
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
        const eventData = {
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
        const [eventId] = yield (0, config_1.default)("calendar_events").insert(eventData);
        const event = yield (0, config_1.default)("calendar_events").where({ id: eventId }).first();
        res.status(201).json({
            status: "success",
            message: "Calendar event created successfully",
            data: event,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error creating calendar event" });
    }
});
exports.createCalendarEvent = createCalendarEvent;
/**
 * Get all calendar events for NGO
 */
const getCalendarEvents = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { start_date, end_date, event_type } = req.query;
        // Verify user is NGO
        const ngo = yield (0, config_1.default)("organizations").where({ user_id: userId }).first();
        if (!ngo) {
            return res.status(403).json({
                status: "fail",
                message: "Only NGOs can view calendar events",
            });
        }
        let query = (0, config_1.default)("calendar_events").where({ user_id: userId });
        // Filter by date range if provided
        if (start_date) {
            query = query.where("start_time", ">=", new Date(start_date));
        }
        if (end_date) {
            query = query.where("end_time", "<=", new Date(end_date));
        }
        // Filter by event type if provided
        if (event_type) {
            query = query.where("event_type", event_type);
        }
        const events = yield query.orderBy("start_time", "asc");
        res.status(200).json({
            status: "success",
            data: events,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error fetching calendar events" });
    }
});
exports.getCalendarEvents = getCalendarEvents;
/**
 * Get single calendar event by ID (NGO only)
 */
const getCalendarEventById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        // Verify user is NGO
        const ngo = yield (0, config_1.default)("organizations").where({ user_id: userId }).first();
        if (!ngo) {
            return res.status(403).json({
                status: "fail",
                message: "Only NGOs can view calendar events",
            });
        }
        const event = yield (0, config_1.default)("calendar_events")
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
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error fetching calendar event" });
    }
});
exports.getCalendarEventById = getCalendarEventById;
/**
 * Update calendar event (NGO only)
 */
const updateCalendarEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        const { title, description, start_time, end_time, event_type, location, attendees, } = req.body;
        const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (start_time && { start_time: new Date(start_time) })), (end_time && { end_time: new Date(end_time) })), (event_type && { event_type })), (location && { location })), (attendees && { attendees }));
        // Verify user is NGO
        const ngo = yield (0, config_1.default)("orga").where({ user_id: userId }).first();
        if (!ngo) {
            return res.status(403).json({
                status: "fail",
                message: "Only NGOs can update calendar events",
            });
        }
        // Check if event exists and belongs to user
        const event = yield (0, config_1.default)("calendar_events")
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
        const dataToUpdate = Object.assign(Object.assign({}, updateData), { updated_at: new Date() });
        // Convert date strings to Date objects if they exist
        if (updateData.start_time) {
            dataToUpdate.start_time = new Date(updateData.start_time);
        }
        if (updateData.end_time) {
            dataToUpdate.end_time = new Date(updateData.end_time);
        }
        yield (0, config_1.default)("calendar_events").where({ id }).update(dataToUpdate);
        const updatedEvent = yield (0, config_1.default)("calendar_events").where({ id }).first();
        res.status(200).json({
            status: "success",
            message: "Calendar event updated successfully",
            data: updatedEvent,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error updating calendar event" });
    }
});
exports.updateCalendarEvent = updateCalendarEvent;
/**
 * Delete calendar event (NGO only)
 */
const deleteCalendarEvent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        // Verify user is NGO
        const ngo = yield (0, config_1.default)("organizations").where({ user_id: userId }).first();
        if (!ngo) {
            return res.status(403).json({
                status: "fail",
                message: "Only NGOs can delete calendar events",
            });
        }
        // Check if event exists and belongs to user
        const event = yield (0, config_1.default)("calendar_events")
            .where({ id, user_id: userId })
            .first();
        if (!event) {
            return res
                .status(404)
                .json({ status: "fail", message: "Calendar event not found" });
        }
        yield (0, config_1.default)("calendar_events").where({ id }).del();
        res.status(200).json({
            status: "success",
            message: "Calendar event deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error deleting calendar event" });
    }
});
exports.deleteCalendarEvent = deleteCalendarEvent;
/**
 * Get calendar events by project ID (NGO only)
 */
const getCalendarEventsByProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { projectId } = req.params;
        // Verify user is NGO
        const ngo = yield (0, config_1.default)("organizations").where({ user_id: userId }).first();
        if (!ngo) {
            return res.status(403).json({
                status: "fail",
                message: "Only NGOs can view calendar events",
            });
        }
        const events = yield (0, config_1.default)("calendar_events")
            .where({ user_id: userId, project_id: projectId })
            .orderBy("start_time", "asc");
        res.status(200).json({
            status: "success",
            data: events,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ status: "fail", message: "Error fetching calendar events" });
    }
});
exports.getCalendarEventsByProject = getCalendarEventsByProject;

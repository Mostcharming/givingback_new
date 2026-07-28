/**
 * Database Models and Interfaces
 * Notifications and Calendar Events
 */

// ============================================================
// NOTIFICATION MODELS
// ============================================================

export type NotificationIconType = "deposit" | "withdrawal" | "info";

export interface Notification {
  id: number;
  user_id: number;
  icon_type: NotificationIconType;
  amount: number;
  action: string;
  target: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateNotificationDTO {
  user_id: number;
  icon_type: NotificationIconType;
  amount: number;
  action: string;
  target: string;
  status: string;
}

export interface UpdateNotificationDTO {
  icon_type?: NotificationIconType;
  amount?: number;
  action?: string;
  target?: string;
  status?: string;
}

// ============================================================
// CALENDAR EVENT MODELS
// ============================================================

export type EventType = "project" | "milestone" | "meeting" | "deadline" | "other";

export interface CalendarEvent {
  id: number;
  user_id: number;
  project_id: number | null;
  title: string;
  description: string | null;
  start_time: Date;
  end_time: Date;
  event_type: EventType;
  location: string | null;
  attendees: number[] | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCalendarEventDTO {
  user_id: number;
  project_id?: number | null;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  event_type?: EventType;
  location?: string;
  attendees?: number[];
}

export interface UpdateCalendarEventDTO {
  title?: string;
  description?: string;
  start_time?: Date;
  end_time?: Date;
  event_type?: EventType;
  location?: string;
  attendees?: number[];
}

// ============================================================
// RESPONSE DTOs
// ============================================================

export interface NotificationResponse extends Notification {
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface CalendarEventResponse extends CalendarEvent {
  user?: {
    id: number;
    name: string;
    email: string;
  };
  project?: {
    id: number;
    title: string;
  };
  attendeeDetails?: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

// ============================================================
// QUERY FILTERS
// ============================================================

export interface NotificationQueryFilter {
  user_id?: number;
  icon_type?: NotificationIconType;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface CalendarEventQueryFilter {
  user_id?: number;
  project_id?: number;
  event_type?: EventType;
  startDate?: Date;
  endDate?: Date;
  upcomingOnly?: boolean;
  limit?: number;
  offset?: number;
}

// ============================================================
// PAGINATION RESPONSE
// ============================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

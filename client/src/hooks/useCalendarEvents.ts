import { useEffect, useState } from "react";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";

export type EventType =
  | "project"
  | "milestone"
  | "meeting"
  | "deadline"
  | "other";

export interface CalendarEvent {
  id: number;
  user_id: number;
  project_id: number | null;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  event_type: EventType;
  location: string | null;
  attendees: number[] | null;
  created_at: string;
  updated_at: string;
}

interface DayGroup {
  label: string;
  events: CalendarEvent[];
}

interface CalendarResponse {
  status: string;
  data: CalendarEvent[];
}

export const useCalendarEvents = () => {
  const { authState } = useContent();
  const [dayGroups, setDayGroups] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = authState.user?.role;

  // Calendar events are only for NGO
  const isNGO = role === "NGO";

  const { mutate: fetchEventsAPI } = useBackendService<CalendarResponse, Error>(
    "/ngo/calendar/events",
    "GET",
    {
      onSuccess: (data) => {
        if (data?.data && Array.isArray(data.data)) {
          const grouped = groupEventsByDay(data.data);
          setDayGroups(grouped);
        }
        setError(null);
      },
      onError: (err: Error) => {
        console.error("Error fetching calendar events:", err);
        setError("Failed to load calendar events");
      },
    },
  );

  const fetchCalendarEvents = () => {
    if (!isNGO) return;

    setLoading(true);
    fetchEventsAPI({}, {});
    setLoading(false);
  };

  useEffect(() => {
    if (isNGO) {
      fetchCalendarEvents();
    }
  }, [isNGO, fetchEventsAPI]);

  const [deleteEventId, setDeleteEventId] = useState<number | null>(null);

  const { mutate: deleteEventAPI } = useBackendService<
    { status: string },
    Error
  >("/ngo/calendar/events/:id", "DELETE", {
    onSuccess: () => {
      if (deleteEventId !== null) {
        setDayGroups((prev) =>
          prev
            .map((group) => ({
              ...group,
              events: group.events.filter((e) => e.id !== deleteEventId),
            }))
            .filter((group) => group.events.length > 0),
        );
        setDeleteEventId(null);
      }
    },
    onError: (err: Error) => {
      console.error("Error deleting event:", err);
    },
  });

  const deleteEvent = (id: number) => {
    setDeleteEventId(id);
    deleteEventAPI({}, {});
  };

  interface CreateEventResponse {
    status: string;
    data: CalendarEvent;
  }

  const { mutate: createEventAPI } = useBackendService<
    CreateEventResponse,
    Error
  >("/ngo/calendar/events", "POST", {
    onSuccess: () => {
      // Refetch to update the list
      fetchCalendarEvents();
    },
    onError: (err: Error) => {
      console.error("Error creating event:", err);
    },
  });

  const createEvent = (
    eventData: Omit<
      CalendarEvent,
      "id" | "user_id" | "created_at" | "updated_at"
    >,
  ) => {
    createEventAPI(eventData, {});
  };

  return {
    dayGroups,
    loading,
    error,
    refetch: fetchCalendarEvents,
    deleteEvent,
    createEvent,
    isNGO,
  };
};

// Helper function to group events by day
const groupEventsByDay = (events: CalendarEvent[]): DayGroup[] => {
  const grouped: { [key: string]: CalendarEvent[] } = {};

  events.forEach((event) => {
    const date = new Date(event.start_time);
    const dateKey = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });

  // Convert to DayGroup array and sort by date
  return Object.entries(grouped)
    .map(([label, events]) => ({
      label,
      events: events.sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      ),
    }))
    .sort((a, b) => {
      const dateA = new Date(a.events[0].start_time);
      const dateB = new Date(b.events[0].start_time);
      return dateA.getTime() - dateB.getTime();
    });
};

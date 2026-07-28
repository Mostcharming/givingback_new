import { useEffect, useState } from "react";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";

export type IconType = "deposit" | "withdrawal" | "info";

export interface Notification {
  id: number;
  user_id: number;
  icon_type: IconType;
  amount: number;
  action: string;
  target: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface NotificationResponse {
  status: string;
  data: Notification[];
}

export const useNotifications = () => {
  const { authState } = useContent();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const role = authState.user?.role;

  // Determine the correct endpoint based on user role
  const getEndpoint = (): string => {
    if (role === "NGO") {
      return "/notifications/ngo/notifications";
    } else if (role === "donor" || role === "corporate") {
      return "/notifications/donor-corporate/notifications";
    } else if (role === "admin") {
      return "/notifications/admin/notifications";
    }
    return "/notifications/ngo/notifications"; // Default
  };

  const { mutate: fetchNotificationsAPI } = useBackendService<
    NotificationResponse,
    Error
  >(getEndpoint(), "GET", {
    onSuccess: (data) => {
      if (data?.data && Array.isArray(data.data)) {
        // Transform the data to match UI expectations
        const transformedNotifications = data.data.map((notif) => ({
          ...notif,
          iconType: notif.icon_type,
          time: formatTime(notif.created_at),
        }));
        setNotifications(transformedNotifications);
      }
      setError(null);
    },
    onError: (err: Error) => {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    },
  });

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { mutate: deleteNotificationAPI } = useBackendService<
    { status: string },
    Error
  >("/notifications/notifications/:id", "DELETE", {
    onSuccess: () => {
      if (deleteId !== null) {
        setNotifications((prev) => prev.filter((n) => n.id !== deleteId));
        setDeleteId(null);
      }
    },
    onError: (err: Error) => {
      console.error("Error deleting notification:", err);
    },
  });

  const deleteNotification = (id: number) => {
    setDeleteId(id);
    deleteNotificationAPI({}, {});
  };

  const { mutate: clearNotificationsAPI } = useBackendService<
    { status: string },
    Error
  >("/notifications/notifications", "DELETE", {
    onSuccess: () => {
      setNotifications([]);
    },
    onError: (err: Error) => {
      console.error("Error clearing notifications:", err);
    },
  });

  const clearAllNotifications = () => {
    clearNotificationsAPI({}, {});
  };

  useEffect(() => {
    if (role) {
      setLoading(true);
      fetchNotificationsAPI({}, {});
      setLoading(false);
    }
  }, [role, fetchNotificationsAPI]);

  const refetch = () => {
    setLoading(true);
    fetchNotificationsAPI({}, {});
    setLoading(false);
  };

  return {
    notifications,
    loading,
    error,
    refetch,
    deleteNotification,
    clearAllNotifications,
  };
};

// Helper function to format time
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

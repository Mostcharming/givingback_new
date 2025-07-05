import {
  differenceInCalendarDays,
  differenceInMonths,
  format,
  isBefore,
} from "date-fns";

export function getStatusBadgeProps(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return {
        text: "In Progress",
        backgroundColor: "#f4e4d6",
        color: "#8b5a2b",
      };
    case "completed":
      return {
        text: "Completed",
        backgroundColor: "#d4edda", // light green
        color: "#155724", // dark green
      };
    default:
      return {
        text: status,
        backgroundColor: "#e2e3e5", // neutral background
        color: "#6c757d", // neutral text
      };
  }
}

export const getDateInfo = (startDate, endDate) => {
  const today = startDate ? new Date(startDate) : new Date("2025-01-01");
  const end = endDate ? new Date(endDate) : new Date("2025-01-01");

  const formattedEndDate = format(end, "MMM d, yyyy");
  const formattedStartDate = format(today, "MMM d, yyyy");

  const daysRemaining = differenceInCalendarDays(end, today);
  const monthsDuration = differenceInMonths(end, today);

  return {
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
    isEnded: isBefore(end, today),
    formattedEndDate,
    formattedStartDate,
    durationInMonths: monthsDuration > 0 ? monthsDuration : 0,
  };
};

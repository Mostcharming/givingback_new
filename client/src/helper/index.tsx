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

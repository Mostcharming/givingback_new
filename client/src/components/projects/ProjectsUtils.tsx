/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckCircle,
  Clock,
  FileText,
  FileUser,
  FolderDot,
  FolderOpen,
  FolderOpenDot,
  Scroll,
} from "lucide-react";
import type { StatCardItem } from "./ProjectsTypes";

/**
 * Get default stats items for error state
 */
export const getDefaultStatsItems = (): StatCardItem[] => [
  {
    title: "Completed Projects",
    amount: 0,
    iconClass: <FolderDot size={24} />,
    color: "#128330",
  },
  {
    title: "Active Briefs",
    amount: 0,
    iconClass: <Scroll size={24} />,
    color: "#9C27B0",
  },
  {
    title: "Ongoing Projects",
    amount: 0,
    iconClass: <FolderOpenDot size={24} />,
    color: "#2196F3",
  },
  {
    title: "Total Applications",
    amount: 0,
    iconClass: <FileUser size={24} />,
    color: "#FFC107",
  },
];

/**
 * Get stats items from API response
 */
export const getStatsFromResponse = (res: any): StatCardItem[] => [
  {
    title: "Completed Projects",
    amount: res.completedProjects || 0,
    iconClass: <CheckCircle size={24} />,
    color: "#128330",
  },
  {
    title: "Active Briefs",
    amount: res.activeBriefs || 0,
    iconClass: <FileText size={24} />,
    color: "#2196F3",
  },
  {
    title: "Ongoing Projects",
    amount: res.ongoingProjects || 0,
    iconClass: <Clock size={24} />,
    color: "#FFC107",
  },
  {
    title: "Total Applications",
    amount: res.totalApplications || 0,
    iconClass: <FolderOpen size={24} />,
    color: "#9C27B0",
  },
];

/**
 * Get status badge styles based on project status
 */
export const getStatusStyles = (status: string) => {
  const styles: Record<string, { backgroundColor: string; color: string }> = {
    active: { backgroundColor: "#d4edda", color: "#155724" },
    completed: { backgroundColor: "#d1ecf1", color: "#0c5460" },
    pending: { backgroundColor: "#f8d7da", color: "#721c24" },
  };
  return styles[status] || styles.pending;
};

/**
 * Format currency amount in Naira
 */
export const formatCurrency = (amount: number): string => {
  return `₦${amount?.toLocaleString() || "0"}`;
};

/**
 * Format status text for display
 */
export const formatStatus = (status: string): string => {
  return status?.charAt(0).toUpperCase() + status?.slice(1) || "Pending";
};

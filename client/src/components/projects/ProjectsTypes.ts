// Type definitions for project-related components

export interface ProjectStats {
  completedProjects: number;
  activeBriefs: number;
  ongoingProjects: number;
  totalApplications: number;
}

export interface Area {
  id: number;
  name: string;
}

export interface Project {
  id: string | number;
  title: string;
  description: string;
  category: string;
  cost: number;
  status: "active" | "completed" | "pending";
  applications: number;
}

export interface StatCardItem {
  title: string;
  amount: number;
  iconClass: JSX.Element;
  color: string;
}

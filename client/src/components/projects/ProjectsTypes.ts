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
  status: "active" | "completed" | "pending" | "draft" | "brief";
  applications: number;
  endDate?: string;
  state?: string;
  ispublic?: number;
  capital?: string;
  createdAt?: string;
  hasMilestones?: boolean;
  milestonesCount?: number;
  allocated?: number | null;
  multi_ngo?: number;
  organization_id?: number | null;
}

export interface StatCardItem {
  title: string;
  amount: number;
  iconClass: JSX.Element;
  color: string;
}

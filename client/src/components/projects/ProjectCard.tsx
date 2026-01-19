import {
  Calendar,
  CheckCheck,
  CheckCircle,
  FileText,
  MapPin,
  MoreVertical,
  PenTool,
  Users,
  Wallet,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import EmptyNGO from "../../assets/images/emptyngo.svg";
import { STYLES } from "./ProjectsStyles";
import type { Project } from "./ProjectsTypes";
import { formatCurrency, formatStatus, getStatusStyles } from "./ProjectsUtils";

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return <CheckCheck size={12} style={{ marginRight: "2px" }} />;
    case "completed":
      return <CheckCircle size={12} style={{ marginRight: "2px" }} />;
    case "brief":
      return <FileText size={12} style={{ marginRight: "2px" }} />;
    case "draft":
      return <PenTool size={12} style={{ marginRight: "2px" }} />;
    default:
      return null;
  }
};

export const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = getStatusStyles(status);
  return (
    <div
      style={{
        backgroundColor: statusStyles.backgroundColor,
        color: statusStyles.color,
        padding: "4px 8px",
        borderRadius: "20px",
        fontSize: "10px",
        fontWeight: "600",
        whiteSpace: "nowrap" as const,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2px",
        height: "fit-content",
      }}
    >
      {getStatusIcon(status)}
      {formatStatus(status)}
    </div>
  );
};

export const ProjectCard = ({ project }: { project: Project }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleOptionsClick = () => {
    navigate(`/donor/projects/${project.id}`);
  };

  return (
    <Card key={project.id} style={STYLES.projectCard}>
      <CardBody style={STYLES.projectCardBody}>
        <div style={STYLES.projectHeader}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <h4
                style={{ ...STYLES.projectTitle, margin: 0, lineHeight: "1.2" }}
              >
                {project.title}
              </h4>
              <StatusBadge status={project.status} />
            </div>
            <p style={STYLES.projectDescription}>{project.description}</p>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                marginTop: "12px",
                fontSize: "13px",
                color: "#555",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Wallet size={16} />
                <span>Budget: {formatCurrency(project.cost)}</span>
              </div>

              {project.createdAt && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Calendar size={16} />
                  <span>
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {project.endDate && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Calendar size={16} />
                  <span>
                    Deadline: {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <MapPin size={16} />
                <span>
                  Location: {project.state || "Nigeria"}
                  {project.capital ? `, ${project.capital}` : ""}
                </span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Users size={16} />
                <span>Applications: {project.applications ?? 0}</span>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <button
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
              onClick={handleOptionsClick}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                opacity: showMenu ? 1 : 0.6,
              }}
              title="View project details"
            >
              <MoreVertical size={20} color="#555" />
            </button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const EmptyState = () => (
  <div style={STYLES.emptyState}>
    <img src={EmptyNGO} alt="No data" style={STYLES.emptyStateImage} />
    <p style={{ fontSize: "16px", color: "#666666" }}>
      No projects available at the moment
    </p>
  </div>
);

export const ProjectsList = ({ projects }: { projects: Project[] }) => (
  <div style={STYLES.projectsContainer}>
    {projects.length > 0 ? (
      <div>
        <div>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    ) : (
      <EmptyState />
    )}
  </div>
);

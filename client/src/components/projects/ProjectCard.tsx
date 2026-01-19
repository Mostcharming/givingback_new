import { Card, CardBody } from "reactstrap";
import EmptyNGO from "../../assets/images/emptyngo.svg";
import { STYLES } from "./ProjectsStyles";
import type { Project } from "./ProjectsTypes";
import { formatCurrency, formatStatus, getStatusStyles } from "./ProjectsUtils";

export const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles = getStatusStyles(status);
  return (
    <div
      style={{
        backgroundColor: statusStyles.backgroundColor,
        color: statusStyles.color,
        padding: "6px 12px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap" as const,
      }}
    >
      {formatStatus(status)}
    </div>
  );
};

export const ProjectDetailItem = ({
  label,
  value,
  isBold = false,
}: {
  label: string;
  value: string | number;
  isBold?: boolean;
}) => (
  <div>
    <p style={STYLES.detailLabel}>{label}</p>
    <p style={{ ...STYLES.detailValue, fontWeight: isBold ? "600" : "400" }}>
      {value}
    </p>
  </div>
);

export const ProjectCard = ({ project }: { project: Project }) => (
  <Card key={project.id} style={STYLES.projectCard}>
    <CardBody style={STYLES.projectCardBody}>
      <div style={STYLES.projectHeader}>
        <div>
          <h4 style={STYLES.projectTitle}>{project.title}</h4>
          <p style={STYLES.projectDescription}>{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div style={STYLES.projectDetails}>
        <ProjectDetailItem label="Category" value={project.category || "N/A"} />
        <ProjectDetailItem
          label="Budget"
          value={formatCurrency(project.cost)}
          isBold
        />
        <ProjectDetailItem
          label="Applications"
          value={project.applications || "0"}
        />
      </div>
    </CardBody>
  </Card>
);

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

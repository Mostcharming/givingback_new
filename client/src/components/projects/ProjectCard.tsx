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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import EmptyNGO from "../../assets/images/emptyngo.svg";
import ShareModal from "../../pages/project/single/ShareModal";
import useBackendService from "../../services/backend_service";
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
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] =
    useState(false);

  const { mutate: publishProject } = useBackendService(
    `/auth/donor/projects/${project.id}/publish`,
    "PUT",
    {
      onSuccess: () => {
        toast.success("Project published successfully!");
        setIsPublishing(false);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      onError: (error: unknown) => {
        let errorMessage = "Failed to create project";
        if (error && typeof error === "object" && "response" in error) {
          const response = (error as Record<string, unknown>).response;
          if (response && typeof response === "object" && "data" in response) {
            const data = (response as Record<string, unknown>).data;
            if (data && typeof data === "object" && "error" in data) {
              errorMessage = String((data as Record<string, unknown>).error);
            }
          }
        }
        console.log("❌ Create Project Error:", errorMessage);

        // Check if the error is about insufficient wallet balance
        if (errorMessage.includes("Insufficient wallet balance")) {
          setShowInsufficientBalanceModal(true);
        } else {
          toast.error(errorMessage);
        }
        // toast.error(errorMessage);
        setIsPublishing(false);
      },
    }
  );

  const handleOptionsClick = () => {
    navigate(`/donor/projects/${project.id}`);
  };

  const handleViewApplications = () => {
    navigate(`/donor/projects/${project.id}`);
  };

  const handleShareBrief = () => {
    setShareModalOpen(true);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    publishProject({ status: "brief" });
  };

  const handleEdit = () => {
    navigate(`/donor/projects/${project.id}`);
  };

  const getActionButtons = () => {
    if (
      project.status.toLowerCase() === "active" ||
      project.status.toLowerCase() === "brief"
    ) {
      return [
        {
          label: "View Project Brief/Applications",
          onClick: handleViewApplications,
          variant: "primary",
        },
        {
          label: "Share Brief",
          onClick: handleShareBrief,
          variant: "secondary",
        },
      ];
    }
    if (project.status.toLowerCase() === "draft") {
      return [
        { label: "Publish", onClick: handlePublish, variant: "primary" },
        { label: "Edit", onClick: handleEdit, variant: "secondary" },
      ];
    }
    return [];
  };

  const handleSaveAsDraftFromInsufficientBalance = () => {
    setShowInsufficientBalanceModal(false);
  };
  const handleGoToFunding = () => {
    setShowInsufficientBalanceModal(false);
    // toggle();
    // Set a flag in sessionStorage to auto-open the fund modal on the funding page
    sessionStorage.setItem("openFundModal", "true");
    navigate("/donor/fund_management_new");
  };

  return (
    <>
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
                  style={{
                    ...STYLES.projectTitle,
                    margin: 0,
                    lineHeight: "1.2",
                  }}
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

                {project.endDate && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
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

              {/* Action Buttons */}
              {getActionButtons().length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  {getActionButtons().map((button, index) => (
                    <button
                      key={index}
                      onClick={button.onClick}
                      disabled={isPublishing && button.label === "Publish"}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                        border: "none",
                        cursor:
                          isPublishing && button.label === "Publish"
                            ? "not-allowed"
                            : "pointer",
                        transition: "all 0.2s ease",
                        backgroundColor:
                          button.variant === "primary" ? "#28a745" : "#f0f0f0",
                        color: button.variant === "primary" ? "#fff" : "#333",
                        boxShadow:
                          button.variant === "primary"
                            ? "0 2px 4px rgba(40, 167, 69, 0.2)"
                            : "none",
                        opacity:
                          isPublishing && button.label === "Publish" ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (isPublishing && button.label === "Publish") return;
                        if (button.variant === "primary") {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#218838";
                        } else {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#e0e0e0";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (button.variant === "primary") {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#28a745";
                        } else {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#f0f0f0";
                        }
                      }}
                    >
                      {isPublishing && button.label === "Publish"
                        ? "Publishing..."
                        : button.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              {project.createdAt && (
                <div
                  style={{
                    fontSize: "13px",
                    color: "#555",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
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
      <ShareModal
        isOpen={shareModalOpen}
        toggle={() => setShareModalOpen(!shareModalOpen)}
      />
      <Modal
        isOpen={showInsufficientBalanceModal}
        centered
        size="md"
        className="insufficient-balance-modal"
      >
        <ModalHeader
          toggle={() => setShowInsufficientBalanceModal(false)}
          style={{ borderBottom: "1px solid #e5e5e5" }}
        >
          <h5 style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>
            Insufficient Wallet Balance
          </h5>
        </ModalHeader>
        <ModalBody style={{ padding: "24px" }}>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "24px" }}>
            You have insufficient wallet balance to create this project. You can
            leave it as a draft and fund your wallet later, or go to funding now
            to add funds to your wallet.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <Button
              style={{
                backgroundColor: "#f3f4f6",
                color: "#1a1a1a",
                border: "none",
                borderRadius: "6px",
                padding: "14px 48px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                flex: 1,
              }}
              onClick={handleSaveAsDraftFromInsufficientBalance}
              // disabled={isLoading}
            >
              {"Leave as Draft"}
            </Button>
            <Button
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "14px 48px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                flex: 1,
              }}
              onClick={handleGoToFunding}
              // disabled={isLoading}
            >
              Go to Funding
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
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

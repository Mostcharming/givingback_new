/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  MapPin,
  Plus,
  Wallet,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import EmptyNGO from "../../../../assets/images/emptyngo.svg";
import placeholder from "../../../../assets/images/home/GivingBackNG-logo.svg";
import CreateMilestoneModal from "../../../../components/projects/CreateMilestoneModal";
import { formatCurrency } from "../../../../components/projects/ProjectsUtils";
import useBackendService from "../../../../services/backend_service";
import { useContent } from "../../../../services/useContext";

interface DonorMilestoneUpdatesProps {
  project: any;
  onBack: () => void;
}

const DonorMilestoneUpdates: React.FC<DonorMilestoneUpdatesProps> = ({
  project,
  onBack,
}) => {
  const { authState } = useContent();
  const [isCreateMilestoneModalOpen, setIsCreateMilestoneModalOpen] =
    useState(false);
  const [milestones, setMilestones] = useState(project?.milestones || []);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [activeOrganization, setActiveOrganization] = useState<number | null>(
    null
  );
  const [reviewingUpdateId, setReviewingUpdateId] = useState<number | null>(
    null
  );
  const canReviewMilestoneUpdates = ["admin", "corporate", "donor"].includes(
    String(authState.user?.role || "").toLowerCase()
  );

  const { mutate: fetchOrganizations } = useBackendService(
    `/auth/projects/${project?.id}/organizations`,
    "GET",
    {
      onSuccess: (res: any) => {
        setOrganizations(res.data || []);
      },
      onError: () => {
        toast.error("Error fetching organizations");
      },
    }
  );

  useEffect(() => {
    if (project?.id) {
      fetchOrganizations({});
    }
  }, [project?.id, fetchOrganizations]);

  const { mutate: reviewMilestoneUpdate } = useBackendService(
    "/auth/milestone-updates/status",
    "PATCH",
    {
      onSuccess: (res: any) => {
        const reviewedUpdate = res.data;

        setMilestones((previousMilestones: any[]) =>
          previousMilestones.map((milestone: any) => ({
            ...milestone,
            updates: (milestone.updates || []).map((update: any) =>
              Number(update.id) === Number(reviewedUpdate.id)
                ? { ...update, ...reviewedUpdate }
                : update
            ),
          }))
        );
        setReviewingUpdateId(null);
        toast.success(res.message || "Milestone update reviewed successfully");
      },
      onError: (error: any) => {
        setReviewingUpdateId(null);
        toast.error(
          error?.response?.data?.message ||
            "Unable to review this milestone update"
        );
      },
    }
  );

  const selectedOrganization = useMemo(
    () =>
      organizations.find(
        (organization: any) =>
          Number(organization.id) === Number(activeOrganization)
      ) || null,
    [organizations, activeOrganization]
  );

  const organizationUpdates = useMemo(() => {
    if (activeOrganization === null) return [];

    return milestones
      .flatMap((milestone: any) =>
        (milestone.updates || [])
          .filter(
            (update: any) =>
              Number(update.organization_id) === Number(activeOrganization)
          )
          .map((update: any) => ({
            ...update,
            milestoneTitle: milestone.milestone,
            milestoneDueDate: milestone.due_date,
          }))
      )
      .sort(
        (first: any, second: any) =>
          new Date(second.createdAt).getTime() -
          new Date(first.createdAt).getTime()
      );
  }, [milestones, activeOrganization]);

  const handleReviewUpdate = (
    milestoneUpdateId: number,
    status: "approved" | "rejected"
  ) => {
    setReviewingUpdateId(milestoneUpdateId);
    reviewMilestoneUpdate({ milestoneUpdateId, status });
  };

  const getReviewStatus = (status: string) => {
    const normalizedStatus = String(status || "pending").toLowerCase();

    if (normalizedStatus === "approved") {
      return {
        label: "Accepted",
        backgroundColor: "#e8f5ec",
        color: "#128330",
      };
    }

    if (normalizedStatus === "rejected") {
      return {
        label: "Rejected",
        backgroundColor: "#fdecec",
        color: "#c62828",
      };
    }

    return {
      label: "Pending review",
      backgroundColor: "#fff5dd",
      color: "#9a6700",
    };
  };

  const handleMilestoneCreated = (newMilestone: any) => {
    setMilestones((prev) => [...prev, newMilestone]);
  };

  return (
    <div className="container-fluid py-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={onBack}
          type="button"
          className="btn text-decoration-none p-0"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <ChevronLeft style={{ width: "1.2rem", height: "1.2rem" }} />
          Back to Briefs
        </button>
      </div>
      <div className="mb-3">
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          {project.title?.charAt(0).toUpperCase() + project.title?.slice(1)}
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "#666",
            lineHeight: "1.6",
          }}
        >
          {project.description?.charAt(0).toUpperCase() +
            project.description?.slice(1)}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "100px",
          fontSize: "13px",
          color: "#555",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Clock size={16} color="green" />
          <span>
            Status:{" "}
            {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Wallet size={16} color="blue" />
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
            <Calendar size={16} color="red" />
            <span>
              Deadline: {new Date(project.endDate).toLocaleDateString()}
            </span>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <MapPin size={16} color="pink" />
          <span>
            Location: {project.state || "Nigeria"}
            {project.capital ? `, ${project.capital}` : ""}
          </span>
        </div>
      </div>
      <div style={{ padding: "10px 0px" }}></div>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          marginTop: "2rem",
        }}
      >
        Project Milestone
      </h2>
      {/* Milestone Updates List or Empty State */}
      <div style={{ marginTop: "24px" }}>
        {milestones && milestones.length > 0 ? (
          <>
            <div>
              {milestones?.map((milestone: any) => (
                <div
                  key={milestone.id}
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "20px",
                    marginBottom: "16px",
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        {milestone.milestone?.charAt(0).toUpperCase() +
                          milestone.milestone?.slice(1)}
                      </h4>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          margin: "0",
                          fontSize: "12px",
                          color: "#333",
                          fontWeight: "600",
                          minWidth: "40px",
                          textAlign: "right",
                        }}
                      >
                        Due date:{" "}
                        {milestone.due_date && (
                          <span style={{ marginRight: "12px", color: "#666" }}>
                            {new Date(milestone.due_date).toLocaleDateString()}
                          </span>
                        )}
                        <span style={{ marginLeft: "12px" }}>
                          {milestone.percentage_complete || 0}%
                        </span>
                      </p>
                      {/* <button
                        onClick={() => handleDeleteMilestone(milestone.id)}
                        type="button"
                        style={{
                          background: "#ff4444",
                          border: "none",
                          color: "white",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          fontWeight: "600",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#cc0000")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#ff4444")
                        }
                      >
                        <Trash2 size={14} />
                        Delete
                      </button> */}
                    </div>
                  </div>

                  <div style={{}}>
                    {/* Progress Bar */}
                    {milestone.target !== undefined && (
                      <div style={{ marginBottom: "20px" }}>
                        <div
                          style={{
                            flex: 1,
                            height: "8px",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${milestone.percentage_complete || 0}%`,
                              backgroundColor: "#28a745",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "10px 50px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 0.3s ease",
                }}
                onClick={() => setIsCreateMilestoneModalOpen(true)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#218838")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#28a745")
                }
              >
                <Plus size={18} />
                Add Project Milestone
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              minHeight: "300px",
            }}
          >
            <img
              src={EmptyNGO}
              alt="No milestones"
              style={{
                width: "120px",
                height: "120px",
                marginBottom: "10px",
                opacity: 0.8,
              }}
            />
            <p
              style={{
                fontSize: "16px",
                color: "#666666",
                textAlign: "center",
                margin: "0",
                marginBottom: "20px",
              }}
            >
              No Data availabe at the moment
            </p>

            <button
              type="button"
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                padding: "10px 50px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "background-color 0.3s ease",
              }}
              onClick={() => setIsCreateMilestoneModalOpen(true)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#218838")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#28a745")
              }
            >
              + Add Project Milestone
            </button>
          </div>
        )}
      </div>

      {/* Create Cards Section */}
      <div style={{ marginTop: "40px" }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {/* Smaller Card - Left (Organizations) */}
          <div
            style={{
              flex: "0 0 calc(25% - 10px)",
              minWidth: "200px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <p
              style={{
                margin: "0 0 16px 0",
                fontSize: "12px",
                color: "#999",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Organizations
            </p>
            {organizations && organizations.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {organizations.map((org: any) => (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() =>
                      setActiveOrganization(
                        activeOrganization === org.id ? null : org.id
                      )
                    }
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      padding: "12px",
                      border: `2px solid ${
                        activeOrganization === org.id ? "#28a745" : "#e0e0e0"
                      }`,
                      borderRadius: "8px",
                      backgroundColor:
                        activeOrganization === org.id ? "#f0f8f5" : "#fff",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      transition:
                        "all 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
                      gap: "12px",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (activeOrganization !== org.id) {
                        e.currentTarget.style.borderColor = "#d0d0d0";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0,0,0,0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeOrganization !== org.id) {
                        e.currentTarget.style.borderColor = "#e0e0e0";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    <img
                      src={org.image || placeholder}
                      alt={org.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0,
                        border: `3px solid ${
                          activeOrganization === org.id ? "#28a745" : "#e0e0e0"
                        }`,
                      }}
                    />
                    <p
                      style={{
                        margin: "0",
                        fontSize: "12px",
                        color: "#333",
                        fontWeight: "600",
                        lineHeight: "1.4",
                        flex: 1,
                      }}
                    >
                      {org.name}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  color: "#666",
                  fontWeight: "500",
                  textAlign: "center",
                  lineHeight: "1.6",
                }}
              >
                No organizations assigned
              </p>
            )}
          </div>

          {/* Larger Card - Right */}
          <div
            style={{
              flex: "1 1 calc(75% - 10px)",
              minWidth: "300px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  color: "#999",
                  fontSize: "12px",
                  fontWeight: "600",
                  margin: "0",
                  textTransform: "uppercase",
                }}
              >
                Project Updates
              </p>
              {selectedOrganization && (
                <span
                  style={{
                    color: "#128330",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {selectedOrganization.name}
                </span>
              )}
            </div>

            {activeOrganization === null ? (
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: "240px",
                  padding: "40px 20px",
                }}
              >
                <img
                  src={EmptyNGO}
                  alt="Select an organization"
                  style={{
                    height: "100px",
                    marginBottom: "10px",
                    opacity: 0.8,
                    width: "100px",
                  }}
                />
                <p
                  style={{
                    color: "#666666",
                    fontSize: "14px",
                    margin: "0",
                    textAlign: "center",
                  }}
                >
                  Select an organization to view its milestone updates
                </p>
              </div>
            ) : organizationUpdates.length === 0 ? (
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: "240px",
                  padding: "40px 20px",
                }}
              >
                <img
                  src={EmptyNGO}
                  alt="No updates"
                  style={{
                    height: "100px",
                    marginBottom: "10px",
                    opacity: 0.8,
                    width: "100px",
                  }}
                />
                <p
                  style={{
                    color: "#666666",
                    fontSize: "14px",
                    margin: "0",
                    textAlign: "center",
                  }}
                >
                  This organization has not submitted a milestone update yet
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "14px" }}
              >
                {organizationUpdates.map((update: any) => {
                  const status = getReviewStatus(update.status);
                  const normalizedStatus = String(
                    update.status || "pending"
                  ).toLowerCase();
                  const canReview =
                    canReviewMilestoneUpdates &&
                    !["approved", "rejected"].includes(normalizedStatus);
                  const isReviewing =
                    reviewingUpdateId === Number(update.id);

                  return (
                    <article
                      key={update.id}
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #e3e7e5",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ padding: "16px" }}>
                        <div
                          style={{
                            alignItems: "flex-start",
                            display: "flex",
                            gap: "12px",
                            justifyContent: "space-between",
                            marginBottom: "12px",
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                color: "#202521",
                                fontSize: "15px",
                                fontWeight: "600",
                                margin: "0 0 4px",
                              }}
                            >
                              {update.milestoneTitle || "Project milestone"}
                            </h4>
                            <span style={{ color: "#858b87", fontSize: "11px" }}>
                              Submitted {update.createdAt
                                ? new Date(update.createdAt).toLocaleString()
                                : "recently"}
                            </span>
                          </div>
                          <span
                            style={{
                              backgroundColor: status.backgroundColor,
                              borderRadius: "999px",
                              color: status.color,
                              fontSize: "11px",
                              fontWeight: "600",
                              padding: "5px 9px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {status.label}
                          </span>
                        </div>

                        <p
                          style={{
                            color: "#4e5550",
                            fontSize: "13px",
                            lineHeight: "1.6",
                            margin: "0 0 14px",
                          }}
                        >
                          {update.narration || "No update narrative provided."}
                        </p>

                        <div
                          style={{
                            alignItems: "center",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "16px",
                          }}
                        >
                          <div>
                            <span
                              style={{
                                color: "#8a908c",
                                display: "block",
                                fontSize: "10px",
                                marginBottom: "3px",
                                textTransform: "uppercase",
                              }}
                            >
                              Target achieved
                            </span>
                            <strong style={{ color: "#252a26", fontSize: "13px" }}>
                              {Number(update.achievement || 0).toLocaleString()}
                            </strong>
                          </div>

                          {update.image && (
                            <a
                              href={update.image}
                              rel="noreferrer"
                              target="_blank"
                              style={{ marginLeft: "auto" }}
                            >
                              <img
                                src={update.image}
                                alt="Milestone update evidence"
                                style={{
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "6px",
                                  height: "56px",
                                  objectFit: "cover",
                                  width: "72px",
                                }}
                              />
                            </a>
                          )}
                        </div>
                      </div>

                      {canReview && (
                        <div
                          style={{
                            borderTop: "1px solid #edf0ee",
                            display: "flex",
                            gap: "10px",
                            justifyContent: "flex-end",
                            padding: "12px 16px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleReviewUpdate(Number(update.id), "rejected")
                            }
                            disabled={reviewingUpdateId !== null}
                            style={{
                              alignItems: "center",
                              backgroundColor: "#fff",
                              border: "1px solid #dc3545",
                              borderRadius: "6px",
                              color: "#c62828",
                              cursor:
                                reviewingUpdateId !== null
                                  ? "not-allowed"
                                  : "pointer",
                              display: "flex",
                              fontSize: "12px",
                              fontWeight: "600",
                              gap: "6px",
                              opacity: reviewingUpdateId !== null ? 0.6 : 1,
                              padding: "8px 13px",
                            }}
                          >
                            <X size={14} />
                            {isReviewing ? "Reviewing..." : "Reject"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleReviewUpdate(Number(update.id), "approved")
                            }
                            disabled={reviewingUpdateId !== null}
                            style={{
                              alignItems: "center",
                              backgroundColor: "#128330",
                              border: "1px solid #128330",
                              borderRadius: "6px",
                              color: "#fff",
                              cursor:
                                reviewingUpdateId !== null
                                  ? "not-allowed"
                                  : "pointer",
                              display: "flex",
                              fontSize: "12px",
                              fontWeight: "600",
                              gap: "6px",
                              opacity: reviewingUpdateId !== null ? 0.6 : 1,
                              padding: "8px 13px",
                            }}
                          >
                            <Check size={14} />
                            {isReviewing ? "Reviewing..." : "Accept"}
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateMilestoneModal
        isOpen={isCreateMilestoneModalOpen}
        toggle={() => setIsCreateMilestoneModalOpen(false)}
        projectId={project?.id}
        milestonesCount={milestones.length}
        onSuccess={(newMilestone) => {
          handleMilestoneCreated(newMilestone);
          setIsCreateMilestoneModalOpen(false);
        }}
      />
    </div>
  );
};

export default DonorMilestoneUpdates;

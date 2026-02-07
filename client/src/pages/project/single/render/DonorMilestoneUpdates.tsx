/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, ChevronLeft, Clock, MapPin, Wallet } from "lucide-react";
import React, { useState } from "react";
import EmptyNGO from "../../../../assets/images/emptyngo.svg";
import CreateMilestoneModal from "../../../../components/projects/CreateMilestoneModal";
import { formatCurrency } from "../../../../components/projects/ProjectsUtils";

interface DonorMilestoneUpdatesProps {
  project: any;
  onBack: () => void;
}

const DonorMilestoneUpdates: React.FC<DonorMilestoneUpdatesProps> = ({
  project,
  onBack,
}) => {
  const [isCreateMilestoneModalOpen, setIsCreateMilestoneModalOpen] =
    useState(false);
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
        {project.milestones && project.milestones.length > 0 ? (
          <div>
            {project?.milestones.map((milestone: any) => (
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
                    marginBottom: "16px",
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
                      {milestone.title}
                    </h4>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      {milestone.ngo_name}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          milestone.status === "completed"
                            ? "#28a745"
                            : milestone.status === "in_progress"
                            ? "#ffc107"
                            : "#6c757d",
                        color: "white",
                        borderRadius: "20px",
                        padding: "6px 12px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {milestone.status?.charAt(0).toUpperCase() +
                        milestone.status?.slice(1).replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #e0e0e0",
                    paddingTop: "16px",
                    marginBottom: "16px",
                  }}
                >
                  {/* Milestone Info */}
                  <div
                    style={{
                      display: "flex",
                      gap: "40px",
                      marginBottom: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    {milestone.deadline && (
                      <div>
                        <p
                          style={{
                            margin: "0 0 6px 0",
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: "600",
                          }}
                        >
                          Deadline
                        </p>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "13px",
                            color: "#333",
                            fontWeight: "500",
                          }}
                        >
                          {new Date(milestone.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {milestone.percentage_complete !== undefined && (
                      <div>
                        <p
                          style={{
                            margin: "0 0 6px 0",
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: "600",
                          }}
                        >
                          Completion
                        </p>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "13px",
                            color: "#333",
                            fontWeight: "600",
                          }}
                        >
                          {milestone.percentage_complete}%
                        </p>
                      </div>
                    )}

                    {milestone.date_submitted && (
                      <div>
                        <p
                          style={{
                            margin: "0 0 6px 0",
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: "600",
                          }}
                        >
                          Submitted On
                        </p>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "13px",
                            color: "#333",
                            fontWeight: "500",
                          }}
                        >
                          {new Date(
                            milestone.date_submitted
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Milestone Description */}
                  {milestone.description && (
                    <div style={{ marginBottom: "20px" }}>
                      <p
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          color: "#999",
                          fontWeight: "600",
                        }}
                      >
                        Description
                      </p>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "13px",
                          color: "#555",
                          lineHeight: "1.6",
                        }}
                      >
                        {milestone.description}
                      </p>
                    </div>
                  )}

                  {/* Deliverables */}
                  {milestone.deliverables &&
                    milestone.deliverables.length > 0 && (
                      <div style={{ marginBottom: "20px" }}>
                        <p
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: "600",
                          }}
                        >
                          Deliverables
                        </p>
                        <ul
                          style={{
                            margin: "0",
                            paddingLeft: "20px",
                            listStyleType: "disc",
                          }}
                        >
                          {milestone.deliverables.map(
                            (deliverable: string, idx: number) => (
                              <li
                                key={idx}
                                style={{
                                  margin: "6px 0",
                                  fontSize: "13px",
                                  color: "#555",
                                  lineHeight: "1.5",
                                }}
                              >
                                {deliverable}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Media/Attachments */}
                  {milestone.attachments &&
                    milestone.attachments.length > 0 && (
                      <div>
                        <p
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: "600",
                          }}
                        >
                          Attachments
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          {milestone.attachments.map(
                            (attachment: any, idx: number) => (
                              <a
                                key={idx}
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "8px 12px",
                                  backgroundColor: "#f0f0f0",
                                  borderRadius: "4px",
                                  textDecoration: "none",
                                  color: "#28a745",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                📎 {attachment.name || "Download"}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
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
                margin: "0 0 12px 0",
                fontSize: "12px",
                color: "#999",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Organizations
            </p>
            <div style={{ minHeight: "100px" }}>
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  color: "#666",
                  fontWeight: "500",
                  lineHeight: "1.6",
                }}
              >
                {project.organization_ids && project.organization_ids.length > 0
                  ? `${project.organization_ids.length} Organization${
                      project.organization_ids.length > 1 ? "s" : ""
                    } assigned`
                  : "No organizations assigned"}
              </p>
            </div>
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
            <p
              style={{
                margin: "0 0 16px 0",
                fontSize: "12px",
                color: "#999",
                fontWeight: "600",
                textTransform: "uppercase",
              }}
            >
              Project Updates
            </p>
            {project.milestones && project.milestones.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  gap: "30px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "11px",
                      color: "#999",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Milestones
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "18px",
                      color: "#333",
                      fontWeight: "700",
                    }}
                  >
                    {project.milestones?.length || 0}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "11px",
                      color: "#999",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    Completed
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "18px",
                      color: "#28a745",
                      fontWeight: "700",
                    }}
                  >
                    {project.milestones?.filter(
                      (m: any) => m.status === "completed"
                    ).length || 0}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "11px",
                      color: "#999",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    In Progress
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "18px",
                      color: "#ffc107",
                      fontWeight: "700",
                    }}
                  >
                    {project.milestones?.filter(
                      (m: any) => m.status === "in_progress"
                    ).length || 0}
                  </p>
                </div>

                <div>
                  <p
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "11px",
                      color: "#999",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    Pending
                  </p>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "18px",
                      color: "#6c757d",
                      fontWeight: "700",
                    }}
                  >
                    {project.milestones?.filter(
                      (m: any) => m.status === "pending"
                    ).length || 0}
                  </p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 20px",
                  minHeight: "200px",
                }}
              >
                <img
                  src={EmptyNGO}
                  alt="No updates"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginBottom: "10px",
                    opacity: 0.8,
                  }}
                />
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666666",
                    textAlign: "center",
                    margin: "0",
                  }}
                >
                  No updates available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Milestone Modal */}
      <CreateMilestoneModal
        isOpen={isCreateMilestoneModalOpen}
        toggle={() => setIsCreateMilestoneModalOpen(false)}
        projectId={project?.id}
        onSuccess={() => setIsCreateMilestoneModalOpen(false)}
      />
    </div>
  );
};

export default DonorMilestoneUpdates;

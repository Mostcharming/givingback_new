/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, ChevronLeft, Clock, MapPin, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatCurrency } from "../../../../components/projects/ProjectsUtils";
import useBackendService from "../../../../services/backend_service";

interface DonorMilestoneUpdatesProps {
  project: any;
  onBack: () => void;
}

const DonorMilestoneUpdates: React.FC<DonorMilestoneUpdatesProps> = ({
  project,
  onBack,
}) => {
  const [milestones, setMilestones] = useState<any[]>([]);

  const { mutate: fetchMilestones } = useBackendService(
    `/auth/donor/projects/${project.id}/milestones`,
    "GET",
    {
      onSuccess: (res: any) => {
        if (res.data) {
          setMilestones(res.data);
        }
      },
      onError: (error: any) => {
        console.error("Error fetching milestones:", error);
        toast.error("Failed to load milestone updates");
      },
    }
  );

  useEffect(() => {
    if (project?.id) {
      fetchMilestones({});
    }
  }, [project?.id, fetchMilestones]);

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
        Milestone Updates
      </h2>

      {/* Milestone Updates List or Empty State */}
      <div style={{ marginTop: "24px" }}>
        {milestones && milestones.length > 0 ? (
          <div>
            {milestones.map((milestone) => (
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
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              minHeight: "300px",
            }}
          >
            <p
              style={{
                fontSize: "16px",
                color: "#666666",
                textAlign: "center",
                margin: "0",
              }}
            >
              No milestone updates yet
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#999999",
                textAlign: "center",
                margin: "8px 0 0 0",
              }}
            >
              Check back later for project milestones
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorMilestoneUpdates;

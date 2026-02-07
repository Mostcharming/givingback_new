/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, ChevronLeft, Clock, MapPin, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EmptyNGO from "../../../../assets/images/emptyngo.svg";
import CreateMilestoneModal from "../../../../components/projects/CreateMilestoneModal";
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
  const [isCreateMilestoneModalOpen, setIsCreateMilestoneModalOpen] =
    useState(false);
  const [milestones, setMilestones] = useState(project?.milestones || []);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [activeOrganization, setActiveOrganization] = useState<number | null>(
    null
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
                  <div
                    key={org.id}
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
                      transition:
                        "all 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
                      gap: "12px",
                    }}
                    onMouseEnter={(e) => {
                      if (activeOrganization !== org.id) {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "#d0d0d0";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 2px 8px rgba(0,0,0,0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeOrganization !== org.id) {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "#e0e0e0";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "none";
                      }
                    }}
                  >
                    {org.image && (
                      <img
                        src={org.image}
                        alt={org.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0,
                          border: `3px solid ${
                            activeOrganization === org.id
                              ? "#28a745"
                              : "#e0e0e0"
                          }`,
                        }}
                      />
                    )}
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
                  </div>
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
          </div>
        </div>
      </div>

      <CreateMilestoneModal
        isOpen={isCreateMilestoneModalOpen}
        toggle={() => setIsCreateMilestoneModalOpen(false)}
        projectId={project?.id}
        onSuccess={(newMilestone) => {
          handleMilestoneCreated(newMilestone);
          setIsCreateMilestoneModalOpen(false);
        }}
      />
    </div>
  );
};

export default DonorMilestoneUpdates;

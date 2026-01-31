/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  MapPin,
  Clock as PendingIcon,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import EmptyNGO from "../../../../assets/images/emptyngo.svg";
import { formatCurrency } from "../../../../components/projects/ProjectsUtils";
import useBackendService from "../../../../services/backend_service";

interface DonorCorporateViewProps {
  project: any;
  onBack: () => void;
  onShare: () => void;
}

const DonorCorporateView: React.FC<DonorCorporateViewProps> = ({
  project,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState("Pending");
  const tabs = ["Pending", "Accepted", "Rejected"];
  const [metrics, setMetrics] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [applications, setApplications] = useState<any[]>([]);

  const getStatusValue = (tab: string): string => {
    const statusMap: Record<string, string> = {
      Pending: "pending",
      Accepted: "accepted",
      Rejected: "rejected",
    };
    return statusMap[tab] || "pending";
  };

  const { mutate: fetchApplications } = useBackendService(
    `/auth/donor/projects/${project.id}/applications`,
    "GET",
    {
      onSuccess: (res: any) => {
        if (res.metrics) {
          setMetrics({
            pending: res.metrics.pending || 0,
            accepted: res.metrics.accepted || 0,
            rejected: res.metrics.rejected || 0,
          });
        }
        if (res.data) {
          setApplications(res.data);
        }
      },
      onError: () => {},
    }
  );

  useEffect(() => {
    if (project?.id) {
      const status = getStatusValue(activeTab);
      fetchApplications({ status });
    }
  }, [project?.id, activeTab, fetchApplications]);

  const counts = {
    Pending: metrics.pending,
    Accepted: metrics.accepted,
    Rejected: metrics.rejected,
  };

  const getIcon = (tab: string) => {
    if (tab === "Pending")
      return <PendingIcon size={18} style={{ marginRight: "8px" }} />;
    if (tab === "Accepted")
      return <CheckCircle size={18} style={{ marginRight: "8px" }} />;
    if (tab === "Rejected")
      return <XCircle size={18} style={{ marginRight: "8px" }} />;
    return null;
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
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "12px 16px",
              borderRadius: "4px",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Edit Project Details and Milestones
          </button>
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "12px 16px",
              borderRadius: "4px",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            View Milestone Updates
          </button>
        </div>
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

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Users size={16} color="orange" />
          <span>Applications: {project.applications ?? 0}</span>
        </div>
      </div>

      <div style={{ padding: "10px 0px" }}></div>

      <div className="tab-container">
        <div className="tab-wrapper">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-button ${activeTab === tab ? "tab-active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {getIcon(tab)}
              {tab}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  fontSize: "12px",
                  fontWeight: "600",
                  marginLeft: "8px",
                }}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Applications List or Empty State */}
      <div style={{ marginTop: "24px" }}>
        {applications.length > 0 ? (
          <div>
            {applications.map((app) => (
              <div
                key={app.id}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "12px",
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
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      flex: 1,
                    }}
                  >
                    {/* NGO Image */}
                    <img
                      src={app.ngo_image || EmptyNGO}
                      alt={app.ngo_name}
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        backgroundColor: "#f0f0f0",
                        flexShrink: 0,
                      }}
                    />
                    {/* NGO Info */}
                    <div style={{ flex: 1 }}>
                      <h5
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        {app.ngo_name}
                      </h5>
                      <p
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        {app.city_lga || "N/A"}
                        {app.state ? `, ${app.state}` : ""}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "24px",
                          fontSize: "12px",
                          color: "#666",
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: "600", color: "#000" }}>
                            {app.ngo_details?.totalProjects || 0}
                          </span>
                          {" Projects"}
                        </div>
                        <div>
                          <span style={{ fontWeight: "600", color: "#000" }}>
                            {app.ngo_details?.completionPercentage || 0}%
                          </span>
                          {" Success rate"}
                        </div>
                        <div>
                          <span style={{ fontWeight: "600", color: "#000" }}>
                            {app.ngo_details?.beneficiaries || 0}
                          </span>
                          {" Beneficiaries"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "12px",
                    }}
                  >
                    <button
                      type="button"
                      className="btn"
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #e0e0e0",
                    paddingTop: "12px",
                    marginBottom: "16px",
                  }}
                >
                  {/* Applied Date, Budget, and Timeline - Side by Side */}
                  <div
                    style={{
                      display: "flex",
                      gap: "40px",
                      marginBottom: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Applied Date */}
                    <div>
                      <p
                        style={{
                          margin: "0 0 6px 0",
                          fontSize: "12px",
                          color: "#999",
                          fontWeight: "600",
                        }}
                      >
                        Applied Date
                      </p>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "13px",
                          color: "#333",
                          fontWeight: "500",
                        }}
                      >
                        {new Date(app.applied_date).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Proposed Budget */}
                    {app.proposed_budget && (
                      <div>
                        <p
                          style={{
                            margin: "0 0 6px 0",
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: "600",
                          }}
                        >
                          Proposed Budget
                        </p>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "13px",
                            color: "#333",
                            fontWeight: "600",
                          }}
                        >
                          {formatCurrency(app.proposed_budget)}
                        </p>
                      </div>
                    )}

                    {/* Timeline */}
                    {app.timeline && (
                      <div>
                        <p
                          style={{
                            margin: "0 0 6px 0",
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: "600",
                          }}
                        >
                          Timeline
                        </p>
                        <p
                          style={{
                            margin: "0",
                            fontSize: "13px",
                            color: "#333",
                            fontWeight: "500",
                          }}
                        >
                          {app.timeline}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Project Summary and Description */}
                  {app.description && (
                    <div style={{ marginBottom: "20px" }}>
                      <p
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "12px",
                          color: "#999",
                          fontWeight: "600",
                        }}
                      >
                        Proposal Summary
                      </p>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "13px",
                          color: "#555",
                          lineHeight: "1.6",
                        }}
                      >
                        {app.description}
                      </p>
                    </div>
                  )}

                  {/* Key Deliverables and Action Buttons */}
                  <div>
                    {/* Key Deliverables */}
                    {app.deliverables && app.deliverables.length > 0 && (
                      <div style={{ marginBottom: "20px" }}>
                        <p
                          style={{
                            margin: "0 0 12px 0",
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: "600",
                          }}
                        >
                          Key Deliverables
                        </p>
                        <ul
                          style={{
                            margin: "0",
                            paddingLeft: "20px",
                            listStyleType: "disc",
                          }}
                        >
                          {app.deliverables.map(
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

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        className="btn"
                        style={{
                          backgroundColor: "#dc3545",
                          color: "white",
                          padding: "10px 20px",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{
                          backgroundColor: "#28a745",
                          color: "white",
                          padding: "10px 20px",
                          borderRadius: "4px",
                          border: "none",
                          fontSize: "13px",
                          fontWeight: "500",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Accept Application
                      </button>
                    </div>
                  </div>
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
            <img
              src={EmptyNGO}
              alt="No applications"
              style={{
                width: "120px",
                height: "120px",
                marginBottom: "16px",
                opacity: 0.7,
              }}
            />
            <p
              style={{
                fontSize: "16px",
                color: "#666666",
                textAlign: "center",
                margin: "0",
              }}
            >
              No {activeTab.toLowerCase()} applications yet
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#999999",
                textAlign: "center",
                margin: "8px 0 0 0",
              }}
            >
              Check back later for new applications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorCorporateView;

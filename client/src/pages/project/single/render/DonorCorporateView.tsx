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
import React, { useState } from "react";
import { formatCurrency } from "../../../../components/projects/ProjectsUtils";

interface DonorCorporateViewProps {
  project: any;
  onBack: () => void;
  onShare: () => void;
}

const DonorCorporateView: React.FC<DonorCorporateViewProps> = ({
  project,
  onBack,
  onShare,
}) => {
  const [activeTab, setActiveTab] = useState("Pending");
  const tabs = ["Pending", "Accepted", "Rejected"];

  const counts = {
    Pending: 0,
    Accepted: 0,
    Rejected: 0,
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

  console.log(onShare);
  console.log(project);
  return (
    <div className="container-fluid py-4">
      <div>
        <button
          onClick={onBack}
          type="button"
          className="btn text-decoration-none p-0 mb-3"
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
          // marginTop: "12px",
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

      {/* Tab Navigation */}
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
                {counts[activeTab as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonorCorporateView;

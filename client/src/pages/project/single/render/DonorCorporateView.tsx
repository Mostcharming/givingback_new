/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  ChevronLeft,
  Clock,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";
import React from "react";
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
    </div>
  );
};

export default DonorCorporateView;

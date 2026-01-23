/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft } from "lucide-react";
import React from "react";

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
      <div className="mb-5">
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

      {/* Support Card for Donors and Corporate */}
      <div className="row mt-5 mb-4">
        <div className="col">
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "40px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Left side text */}
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  lineHeight: "1.2",
                  marginBottom: "5px",
                }}
              >
                Support this project
              </div>
              <div
                style={{
                  color: "#666",
                }}
              >
                Help make a lasting impact
              </div>
            </div>

            {/* Right side buttons */}
            <div style={{ display: "flex", gap: "15px" }}>
              <button
                type="button"
                className="btn btn-outline-dark px-4 py-2"
                style={{ borderRadius: "6px" }}
                onClick={onShare}
              >
                Share
              </button>
              <button
                type="button"
                className="btn btn-success px-4 py-2"
                style={{ borderRadius: "6px" }}
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorCorporateView;

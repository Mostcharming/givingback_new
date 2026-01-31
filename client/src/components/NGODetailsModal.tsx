import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import React from "react";
import EmptyNGO from "../assets/images/emptyngo.svg";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface NGODetailsModalProps {
  open: boolean;
  onClose: () => void;
  ngoData: any;
}

const NGODetailsModal: React.FC<NGODetailsModalProps> = ({
  open,
  onClose,
  ngoData,
}) => {
  if (!ngoData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        NGO Profile
        <IconButton
          onClick={onClose}
          size="small"
          style={{ marginRight: "-8px" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {/* NGO Image */}
          <img
            src={ngoData.ngo_image || EmptyNGO}
            alt={ngoData.ngo_name}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "16px",
              backgroundColor: "#f0f0f0",
            }}
          />
          <h4
            style={{
              margin: "0 0 8px 0",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {ngoData.ngo_name}
          </h4>
          <p
            style={{
              margin: "0 0 16px 0",
              fontSize: "13px",
              color: "#666",
            }}
          >
            {ngoData.city_lga || "N/A"}
            {ngoData.state ? `, ${ngoData.state}` : ""}
          </p>
        </div>

        {/* Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                margin: "0 0 6px 0",
                fontSize: "12px",
                color: "#999",
                fontWeight: "600",
              }}
            >
              Projects
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "20px",
                fontWeight: "700",
                color: "#28a745",
              }}
            >
              {ngoData.ngo_details?.totalProjects || 0}
            </p>
          </div>

          <div
            style={{
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                margin: "0 0 6px 0",
                fontSize: "12px",
                color: "#999",
                fontWeight: "600",
              }}
            >
              Success Rate
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "20px",
                fontWeight: "700",
                color: "#28a745",
              }}
            >
              {ngoData.ngo_details?.completionPercentage || 0}%
            </p>
          </div>

          <div
            style={{
              padding: "12px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                margin: "0 0 6px 0",
                fontSize: "12px",
                color: "#999",
                fontWeight: "600",
              }}
            >
              Beneficiaries
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "20px",
                fontWeight: "700",
                color: "#28a745",
              }}
            >
              {ngoData.ngo_details?.beneficiaries || 0}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: "16px" }}>
          {/* Email */}
          {ngoData.email && (
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                Email
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  color: "#333",
                  wordBreak: "break-all",
                }}
              >
                {ngoData.email}
              </p>
            </div>
          )}

          {/* Phone */}
          {ngoData.phone && (
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                Phone
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  color: "#333",
                }}
              >
                {ngoData.phone}
              </p>
            </div>
          )}

          {/* State */}
          {ngoData.state && (
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                State
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  color: "#333",
                }}
              >
                {ngoData.state}
              </p>
            </div>
          )}

          {/* City/LGA */}
          {ngoData.city_lga && (
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                City/LGA
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  color: "#333",
                }}
              >
                {ngoData.city_lga}
              </p>
            </div>
          )}

          {/* Areas of Interest */}
          {ngoData.interest_area && (
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                Areas of Interest
              </p>
              <ul
                style={{
                  margin: "0",
                  paddingLeft: "20px",
                  listStyleType: "disc",
                }}
              >
                {Array.isArray(ngoData.interest_area)
                  ? ngoData.interest_area.map(
                      (interest: string, idx: number) => (
                        <li
                          key={idx}
                          style={{
                            margin: "4px 0",
                            fontSize: "13px",
                            color: "#555",
                          }}
                        >
                          {interest}
                        </li>
                      )
                    )
                  : ngoData.interest_area
                      .split(",")
                      .map((interest: string, idx: number) => (
                        <li
                          key={idx}
                          style={{
                            margin: "4px 0",
                            fontSize: "13px",
                            color: "#555",
                          }}
                        >
                          {interest.trim()}
                        </li>
                      ))}
              </ul>
            </div>
          )}

          {/* Description */}
          {ngoData.description && (
            <div>
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                About
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  color: "#555",
                  lineHeight: "1.6",
                }}
              >
                {ngoData.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NGODetailsModal;

/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { MapPin } from "lucide-react";
import React from "react";
import EmptyNGO from "../assets/images/emptyngo.svg";

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
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <img
              src={ngoData.ngo_image || EmptyNGO}
              alt={ngoData.ngo_name}
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "#f0f0f0",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                {ngoData.ngo_name}
              </h4>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "86px",
              marginBottom: "12px",
            }}
          >
            <MapPin
              style={{ width: "18px", height: "18px", color: "#28a745" }}
            />
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                color: "#666",
              }}
            >
              Location: {ngoData.ngo_details?.location?.city_lga || "N/A"}
              {ngoData.ngo_details?.state
                ? `, ${ngoData.ngo_details.state}`
                : ""}
            </p>
            {ngoData.ngo_details?.address && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                {ngoData.ngo_details.address}
              </p>
            )}
          </div>
          <div
            style={{
              borderBottom: "1px solid #e0e0e0",
              marginBottom: "16px",
            }}
          />
        </div>

        <div style={{ marginTop: "24px", marginBottom: "24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                Completed Projects
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#28a745",
                }}
              >
                {ngoData.ngo_details?.totalProjects || 0}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                Beneficiaries Reached
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#28a745",
                }}
              >
                {ngoData.ngo_details?.beneficiaries || 0}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  margin: "0",
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
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#28a745",
                }}
              >
                {ngoData.ngo_details?.completionPercentage || 0}%
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <p
                style={{
                  margin: "0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                Team Size
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#28a745",
                }}
              >
                {ngoData.ngo_details?.teamSize || 0}
              </p>
            </div>
            <div
              style={{
                borderBottom: "1px solid #e0e0e0",
                marginBottom: "16px",
              }}
            />
          </div>

          {(ngoData.ngo_details?.registrationNumber ||
            ngoData.ngo_details?.established ||
            ngoData.ngo_details?.annualBudget) && (
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                {ngoData.ngo_details?.registrationNumber && (
                  <div>
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "12px",
                        color: "#999",
                        fontWeight: "600",
                      }}
                    >
                      Registration Number
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "13px",
                        color: "#333",
                      }}
                    >
                      {ngoData.ngo_details.registrationNumber}
                    </p>
                  </div>
                )}
                {ngoData.ngo_details?.established && (
                  <div>
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "12px",
                        color: "#999",
                        fontWeight: "600",
                      }}
                    >
                      Established
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "13px",
                        color: "#333",
                      }}
                    >
                      {ngoData.ngo_details.established}
                    </p>
                  </div>
                )}
                {ngoData.ngo_details?.annualBudget && (
                  <div>
                    <p
                      style={{
                        margin: "0 0 6px 0",
                        fontSize: "12px",
                        color: "#999",
                        fontWeight: "600",
                      }}
                    >
                      Annual Budget
                    </p>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "13px",
                        color: "#333",
                      }}
                    >
                      {ngoData.ngo_details.annualBudget}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {ngoData.ngo_details?.interestArea && (
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "12px",
                  color: "#999",
                  fontWeight: "600",
                }}
              >
                Focus Area
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  margin: "0",
                }}
              >
                {Array.isArray(ngoData.ngo_details.interestArea)
                  ? ngoData.ngo_details.interestArea.map(
                      (interest: string, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            padding: "6px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "13px",
                            color: "#555",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          {interest}
                        </div>
                      )
                    )
                  : ngoData.ngo_details.interestArea
                      .split(",")
                      .map((interest: string, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            padding: "6px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "13px",
                            color: "#555",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          {interest.trim()}
                        </div>
                      ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NGODetailsModal;

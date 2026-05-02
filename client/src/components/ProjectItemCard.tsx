/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize } from "@mui/material";
import { Calendar, MapPin, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col } from "reactstrap";
import { getStatusBadgeProps } from "../helper";
import { useContent } from "../services/useContext";

interface ProjectItemProps {
  type: string;
  project: any;
  image?: string;
  activeTab?: string;
}

export const ProjectItem = (props: ProjectItemProps) => {
  const navigate = useNavigate();
  const { authState } = useContent();
  const role = authState.user?.role;

  const details = () => {
    // Check if on Applications tab with pending status
    if (
      props.activeTab === "Applications" &&
      props.project.status === "pending"
    ) {
      toast.warning("You cannot currently view the details of this project");
      return;
    }

    if (props.type === "past") {
      switch (role) {
        case "NGO":
          navigate(`/ngo/projects/${props.project.id}`);
          break;
        default:
          console.log("Invalid role or no role found");
      }
    } else {
      switch (role) {
        case "admin":
          navigate(`/admin/projects/${props.project.id}`);
          break;
        case "donor":
        case "corporate":
          navigate(`/donor/projects/${props.project.id}`);
          break;
        case "NGO":
          navigate(`/ngo/projects/${props.project.id}`);
          break;
        default:
          console.log("Invalid role or no role found");
      }
    }
  };

  const badgeProps = getStatusBadgeProps(props.project.status);
  const cost = props.project.cost ?? props.project.allocated ?? 0;

  // Calculate progress
  const totalMilestones = props.project.milestones?.length || 0;
  const completedMilestones =
    props.project.milestones?.filter((m) =>
      m.updates?.some((u) => u.status?.toLowerCase() === "completed"),
    ).length || 0;
  const progressPercent = totalMilestones
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  // Truncate description for compact card display
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const displayDescription = truncateDescription(
    props.project.description,
    150,
  );

  return (
    <Col className="px-3 mt-3" lg={12}>
      <div
        onClick={details}
        className="card shadow-sm rounded"
        style={{
          cursor: "pointer",
          // maxWidth: "1000px",
          // margin: "0 auto",
          border: "1px solid #e5e5e5",
          transition: "box-shadow 0.3s ease, transform 0.2s ease",
          padding: "24px",
          borderRadius: "12px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Header with title and status */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: "0 0 4px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "#1a1a1a",
              }}
            >
              {capitalize(props.project.title)}
            </h3>
            <p
              style={{
                margin: "0",
                fontSize: "13px",
                color: "#666",
                lineHeight: "1.4",
              }}
            >
              {displayDescription}
            </p>
          </div>
          <span
            style={{
              backgroundColor: badgeProps.backgroundColor,
              color: badgeProps.color,
              padding: "4px 8px",
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: "600",
              whiteSpace: "nowrap",
              marginLeft: "12px",
            }}
          >
            {badgeProps.text}
          </span>
        </div>

        {/* Progress Bar - Hide for Past and Applications */}
        {props.type !== "past" &&
          props.activeTab !== "Applications" &&
          props.activeTab !== "Past" && (
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ fontSize: "13px", color: "#666" }}>
                  Progress
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#16a34a",
                  }}
                >
                  {progressPercent} %
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#16a34a",
                    width: `${progressPercent}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

        {/* Info Row with icons */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            fontSize: "13px",
          }}
        >
          {/* Budget */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#555",
            }}
          >
            <Wallet size={16} style={{ color: "#000" }} />
            <span style={{ fontWeight: "500" }}>
              Budget:{" "}
              {new Intl.NumberFormat("en-NG", {
                style: "currency",
                currency: "NGN",
              }).format(cost)}
            </span>
          </div>

          {/* Deadline */}
          {props.project.endDate && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#555",
              }}
            >
              <Calendar size={16} style={{ color: "#000" }} />
              <span style={{ fontWeight: "500" }}>
                Deadline:{" "}
                {new Date(props.project.endDate).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#555",
            }}
          >
            <MapPin size={16} style={{ color: "#000" }} />
            <span style={{ fontWeight: "500" }}>
              Location: {props.project.state || "Nigeria"}
            </span>
          </div>
        </div>
      </div>
    </Col>
  );
};

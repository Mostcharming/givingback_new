/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin } from "lucide-react";
import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Col } from "reactstrap";
import place from "../assets/images/project.png";
import { getStatusBadgeProps } from "../helper";
import { useContent } from "../services/useContext";

interface ProjectItemProps {
  type: string;
  project: any;
  image?: string;
}

export const ProjectItem = (props: ProjectItemProps) => {
  const navigate = useNavigate();
  const { authState } = useContent();
  const role = authState.user?.role;

  const details = () => {
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

  const image = props.image ? `${props.image}` : place;
  const badgeProps = getStatusBadgeProps(props.project.status);
  const cost = props.project.cost ?? props.project.allocated ?? 0;

  const totalMilestones = props.project.milestones?.length || 0;
  const completedMilestones =
    props.project.milestones?.filter((m) =>
      m.updates?.some((u) => u.status?.toLowerCase() === "completed")
    ).length || 0;
  const completedMilestoneTargets =
    props.project.milestones
      ?.filter((m) =>
        m.updates?.some((u) => u.status?.toLowerCase() === "completed")
      )
      .reduce((sum, m) => sum + (m.target || 0), 0) || 0;

  const progressPercent = totalMilestones
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  // Truncate description for donor/corporate users to maintain consistent card height
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const displayDescription =
    role === "donor" || role === "corporate"
      ? truncateDescription(props.project.description)
      : props.project.description;

  return (
    <Col className="px-3 mt-4" lg={6}>
      <div
        onClick={details}
        className="card shadow-sm rounded"
        style={{ cursor: "pointer", maxWidth: "600px", margin: "0 auto" }}
      >
        <div className="position-relative">
          <Image
            src={image}
            alt="Person drinking from water tap"
            width={600}
            height={300}
            className="card-img-top"
            style={{ height: "300px", objectFit: "cover" }}
          />
          <div className="position-absolute top-0 end-0 right-0 m-3">
            <span
              className="rounded-pill px-3 py-2"
              style={{
                backgroundColor: badgeProps.backgroundColor,
                color: badgeProps.color,
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {badgeProps.text}
            </span>
          </div>
        </div>

        <div className="card-body p-4">
          <h2 className="card-title h3 fw-bold text-dark mb-3">
            {props.project.title}
          </h2>

          <p
            className="card-text text-muted mb-4"
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              minHeight: "60px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            {displayDescription}
          </p>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted" style={{ fontSize: "16px" }}>
                Progress
              </span>
              <span
                className="fw-bold text-success"
                style={{ fontSize: "18px" }}
              >
                {progressPercent} %
              </span>
            </div>

            <div
              className="progress"
              style={{ height: "8px", backgroundColor: "#e9ecef" }}
            >
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={76}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="h5 fw-bold text-dark mb-0">
                {formatter.format(completedMilestoneTargets)}
              </span>{" "}
              <span className="text-muted ms-1"> raised</span>
            </div>
            <div className="text-muted">
              Goal:{" "}
              <span className="fw-semibold">{formatter.format(cost)}</span>
            </div>
          </div>

          {(role === "donor" || role === "corporate") && (
            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
              <div className="d-flex align-items-center gap-2">
                <MapPin size={20} className="text-muted" />
                <span className="text-muted" style={{ fontSize: "14px" }}>
                  {props.project.state || "N/A"}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  details();
                }}
                className="btn btn-success"
                style={{
                  fontSize: "14px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                }}
              >
                Donate - View details
              </button>
            </div>
          )}
        </div>
      </div>
    </Col>
  );
};

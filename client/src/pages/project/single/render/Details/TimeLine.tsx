import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { getDateInfo } from "../../../../../helper";

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return {
        color: "success",
        bgColor: "bg-success",
        textColor: "text-success",
        label: "Completed",
      };
    case "pending":
      return {
        color: "primary",
        bgColor: "bg-primary",
        textColor: "text-primary",
        label: "Pending approval",
      };
    case "in-progress":
      return {
        color: "warning",
        bgColor: "bg-warning",
        textColor: "text-warning",
        label: "In progress",
      };
    case "upcoming":
      return {
        color: "secondary",
        bgColor: "bg-secondary",
        textColor: "text-secondary",
        label: "Upcoming",
      };
    default:
      return {
        color: "secondary",
        bgColor: "bg-secondary",
        textColor: "text-secondary",
        label: "Unknown",
      };
  }
};

export default function TimelineMile({ project }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id.toString())
        ? prev.filter((item) => item !== id.toString())
        : [...prev, id.toString()]
    );
  };

  return (
    <div className="mb-5">
      <h3 className="h5 mb-3">Timeline & Milestones</h3>

      <div className="list-group list-group-flush">
        {project.milestones?.map((milestone) => {
          const statusConfig = getStatusConfig(milestone.status);
          const isExpanded = expandedItems.includes(milestone.id.toString());
          const { formattedStartDate } = getDateInfo(
            milestone.startDate,
            milestone.endDate
          );

          return (
            <div
              key={milestone.id}
              className="list-group-item border-0 px-0 py-4"
            >
              <div className="d-flex align-items-start">
                <div
                  className={`rounded-circle ${statusConfig.bgColor} mr-3 me-3 flex-shrink-0`}
                  style={{ width: "16px", height: "16px", marginTop: "2px" }}
                ></div>

                <div className="flex-grow-1">
                  {/* Status label with dropdown */}
                  <div className="d-flex align-items-center mb-2">
                    <button
                      className={`btn btn-link p-0 text-decoration-none ${statusConfig.textColor} fw-normal`}
                      onClick={() => toggleExpanded(milestone.id.toString())}
                      style={{ fontSize: "16px" }}
                    >
                      {statusConfig.label}
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>

                  {/* Milestone content - shown when expanded */}
                  {isExpanded && (
                    <>
                      {/* Title */}
                      <h5
                        className="fw-normal text-dark mb-2"
                        style={{ fontSize: "18px" }}
                      >
                        {milestone.milestone}
                      </h5>

                      {/* Date */}
                      <p
                        className="text-muted mb-3"
                        style={{ fontSize: "14px" }}
                      >
                        {formattedStartDate}
                      </p>

                      {/* Description */}
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "14px", lineHeight: "1.5" }}
                      >
                        {milestone.description}
                      </p>
                    </>
                  )}
                </div>

                {/* Attachments - assuming from updates */}
                <div className="d-flex align-items-center text-muted ms-3">
                  <i className="bi bi-paperclip me-1"></i>
                  <span style={{ fontSize: "14px" }}>
                    {milestone.updates?.length ?? 0} attached
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

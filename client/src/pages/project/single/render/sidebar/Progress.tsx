import { getDateInfo } from "../../../../../helper";

const Progress = ({ project }) => {
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  const cost = project.cost ?? project.allocated ?? 0;

  const totalMilestones = project.milestones?.length || 0;
  const completedMilestones =
    project.milestones?.filter((m) =>
      m.updates?.some((u) => u.status?.toLowerCase() === "completed")
    ).length || 0;

  const completedMilestoneTargets =
    project.milestones
      ?.filter((m) =>
        m.updates?.some((u) => u.status?.toLowerCase() === "completed")
      )
      .reduce((sum, m) => sum + (m.target || 0), 0) || 0;

  const progressPercent = totalMilestones
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  const { daysRemaining, isEnded, formattedEndDate } = getDateInfo(
    project.startDate,
    project.endDate
  );

  const donorName = project.donor_id ? project.donor?.name || "Donor" : null;
  const sponsorsCount = project.sponsors?.length || 0;

  return (
    <div
      style={{ border: "none", background: "rgba(18, 131, 48, 0.04)" }}
      className="card mb-4 d-none d-md-block"
    >
      <div className="card-body">
        <h6 className="card-title text-muted mb-3">Funding progress</h6>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <span className="h4 text-dark">
              {formatter.format(completedMilestoneTargets)}
            </span>
            <span className="text-muted"> of {formatter.format(cost)}</span>
          </div>
          <span className="text-success fw-bold">{progressPercent}%</span>
        </div>
        <div className="progress mb-4" style={{ height: "8px" }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <h6 className="text-muted mb-3">Project status</h6>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-dark">
            {completedMilestones} of {totalMilestones} milestones
          </span>
          <span className="text-success fw-bold">{progressPercent}%</span>
        </div>
        <div className="progress mb-4" style={{ height: "8px" }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <h6 className="text-muted mb-2">Time remaining</h6>
        <div className="text-dark fw-bold mb-1">
          {isEnded ? "0 days" : `${daysRemaining} days`}
        </div>
        <div className="text-muted small mb-3">
          {isEnded ? "Ended" : "Ends"} {formattedEndDate}
        </div>

        <h6 className="text-muted mb-1">Donors</h6>
        {donorName && <div className="text-dark fw-bold mb-1">{donorName}</div>}
        <div className="text-muted small">
          Including {sponsorsCount} sponsor{sponsorsCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
};

export default Progress;

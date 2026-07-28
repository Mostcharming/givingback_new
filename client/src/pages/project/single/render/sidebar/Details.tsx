import { getDateInfo } from "../../../../../helper";

const Details = ({ authState, currentUser, project }) => {
  const { formattedStartDate, formattedEndDate, durationInMonths } =
    getDateInfo(project.startDate, project.endDate);

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  const cost = project.cost ?? project.allocated ?? 0;
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h6 className="card-title mb-3">Project details</h6>

        <div className="mb-3">
          <div className="text-muted small mb-1">Category</div>
          <div className="text-dark">
            {project.category ? project.category : ""}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-muted small mb-1">Location</div>
          <div className="text-dark">
            {currentUser.address
              ? `${currentUser.address[0].state} ${currentUser.address[0].city_lga} ${currentUser.address[0].address}`
              : ""}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-muted small mb-1">Duration</div>
          <div className="text-dark">
            {durationInMonths} months ({formattedStartDate} - {formattedEndDate}
            )
          </div>
        </div>

        <div className="mb-3">
          <div className="text-muted small mb-1">Total budget</div>
          <div className="text-dark">{formatter.format(cost)}</div>
        </div>

        <div className="mb-3">
          <div className="text-muted small mb-1">Project manager</div>
          <div className="text-dark">{authState.user.email}</div>
        </div>
      </div>
    </div>
  );
};

export default Details;

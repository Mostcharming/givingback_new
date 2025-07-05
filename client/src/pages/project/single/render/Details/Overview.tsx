const Overview = ({ project }) => {
  return (
    <div className="mb-5">
      <h3 className="h5 mb-3">Project overview</h3>
      <p className="text-muted mb-3">{project.description}</p>

      {/* <h4 className="h6 mb-3">Key objective</h4>
      <ul className="text-muted">
        <li>
          Establish 3 monthly mobile clinic operations in remote communities
        </li>
        <li>
          Provide essential medical equipment to 5 existing rural healthcare
          facilities
        </li>
        <li>
          Conduct 20 health education workshops focused on preventative care
        </li>
        <li>Train 15 community health workers to provide ongoing support</li>
      </ul> */}
    </div>
  );
};
export default Overview;

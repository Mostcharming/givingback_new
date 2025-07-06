import { Plus, Search, Send } from "lucide-react";
import { Image } from "react-bootstrap";

const MileStoneUpdates = ({ logo, project }) => {
  const hasUpdates = project?.milestones?.some(
    (m) => m.updates && m.updates.length > 0
  );

  return (
    <div style={{ width: "80vw" }} className="row">
      <div className="col-12">
        <div className="pt-4 pb-3">
          <h5 className="fw-medium text-dark mb-0" style={{ fontSize: "18px" }}>
            Today
          </h5>
        </div>

        {!hasUpdates ? (
          <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="mb-4">
              <Search
                size={48}
                className="text-muted"
                style={{ opacity: 0.4 }}
              />
            </div>
            <div className="text-center mb-5">
              <h4
                className="fw-medium text-dark mb-3"
                style={{ fontSize: "20px" }}
              >
                No updates yet
              </h4>
              <p
                className="text-muted mb-0"
                style={{ fontSize: "14px", maxWidth: "300px" }}
              >
                There are currently no updates. New updates will appear here as
                they are uploaded.
              </p>
            </div>
          </div>
        ) : (
          project?.milestones?.map((milestone, idx) =>
            milestone.updates?.map((update, updateIdx) => (
              <div className="d-flex mb-4" key={`${milestone.id}-${updateIdx}`}>
                <div className="flex-shrink-0 me-3">
                  <Image
                    src={logo}
                    alt="Update logo"
                    width={50}
                    height={50}
                    className="bg-white rounded-circle m-2"
                  />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <h6 className="mb-0 me-2 fw-semibold text-dark">
                      {project?.donor?.name || "Project Donor"}
                    </h6>
                    <small className="text-muted ml-3">
                      {new Date(update.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <p className="mb-1 text-dark lh-base">{update.narration}</p>

                  {update.image && (
                    <div className="mb-2">
                      <Image
                        src={update.image}
                        alt="Update visual"
                        fluid
                        className="rounded"
                        style={{ maxWidth: "100%", maxHeight: "300px" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        )}

        {/* Add new update */}
        <div className="bg-white border">
          <div className="container-fluid h-100">
            <div className="row h-100 align-items-center">
              <div className="col">
                <div className="d-flex align-items-center justify-content-between py-4 px-3">
                  <span className="text-muted" style={{ fontSize: "16px" }}>
                    Add new update
                  </span>
                  <div className="d-flex gap-3">
                    <button
                      className="btn btn-link p-0 text-muted"
                      style={{ border: "none", background: "none" }}
                    >
                      <Plus size={20} />
                    </button>
                    <button
                      className="btn btn-link p-0 text-muted"
                      style={{ border: "none", background: "none" }}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MileStoneUpdates;

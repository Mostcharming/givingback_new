import { CircleCheckBig } from "lucide-react";

const Progress = ({ progressSteps }) => {
  return (
    <div
      style={{ borderLeft: "1px solid #cecece", height: "100vh" }}
      className="col-lg-4 d-none d-lg-block py-4"
    >
      <div className="position-sticky" style={{ top: "2rem" }}>
        <div className="text-end pt-4 pl-2 pr-4">
          <h5 className="text-decoration-none text-muted">Add past project</h5>
        </div>
        <div className="bg-white rounded-3 pt-4 pl-2 pr-4">
          <div className="list-group list-group-flush">
            {progressSteps.map((step, index) => (
              <div key={index} className="list-group-item border-0 px-0 py-2.5">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    {step.completed ? (
                      <div
                        className=" d-flex align-items-center justify-content-center"
                        style={{
                          width: "24px",
                          height: "24px",
                          color: "#198754",
                          fontSize: "12px",
                        }}
                      >
                        <CircleCheckBig
                          style={{
                            width: "1.3rem",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className=""
                        style={{
                          width: "24px",
                          height: "24px",
                          borderColor: "#dee2e6",
                        }}
                      >
                        <CircleCheckBig
                          style={{
                            width: "1.3rem",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <span
                    className={
                      step.completed
                        ? "text-success ml-3 fw-medium"
                        : "text-muted ml-3"
                    }
                  >
                    {step.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;

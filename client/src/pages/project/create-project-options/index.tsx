import { ChevronRight } from "lucide-react";
import { useState } from "react";

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    duration: "",
    relatedFields: "",
    cost: "",
    amountRaised: "",
    managerEmail: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const progressSteps = [
    { name: "Project details", completed: true },
    { name: "Timeline & Milestones", completed: false },
    { name: "Project sponsor", completed: false },
    { name: "Project beneficiaries", completed: false },
    { name: "Project media", completed: false },
  ];

  return (
    <div className="min-vh-100">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-lg-8">
            <nav
              style={{ background: "white" }}
              aria-label="breadcrumb"
              className="mb-4"
            >
              <ol style={{ background: "white" }} className="breadcrumb">
                <li className="breadcrumb-item">
                  <a className="text-decoration-none text-muted">Projects </a>
                </li>
                <ChevronRight style={{ marginTop: "1px" }} />
                <li className="breadcrumb-item active" aria-current="page">
                  Add project
                </li>
              </ol>
            </nav>

            {/* Main Form */}
            <div className="">
              <div className="mb-4">
                <h2 className="h4 fw-bold mb-2">Project details</h2>
                <p className="text-muted mb-0">
                  Add details about your project here
                </p>
              </div>

              <form>
                {/* Project Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="form-label text-muted">
                    Project title
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom rounded-0 px-0"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    style={{
                      boxShadow: "none",
                      borderColor: "#dee2e6 !important",
                    }}
                  />
                </div>

                {/* Project Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="form-label text-muted"
                  >
                    Project description
                  </label>
                  <textarea
                    className="form-control border-0 border-bottom rounded-0 px-0"
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    style={{
                      boxShadow: "none",
                      borderColor: "#dee2e6 !important",
                      resize: "none",
                    }}
                  />
                </div>

                {/* Project Status and Duration Row */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label text-muted">
                      Project status
                    </label>
                    <select
                      className="form-select border-0 border-bottom rounded-0 px-0"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      style={{
                        boxShadow: "none",
                        borderColor: "#dee2e6 !important",
                      }}
                    >
                      <option value="">Select status</option>
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="duration" className="form-label text-muted">
                      Project duration
                    </label>
                    <input
                      type="date"
                      className="form-control border-0 border-bottom rounded-0 px-0"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      style={{
                        boxShadow: "none",
                        borderColor: "#dee2e6 !important",
                      }}
                    />
                  </div>
                </div>

                {/* Select Related Fields */}
                <div className="mb-4">
                  <label
                    htmlFor="relatedFields"
                    className="form-label text-muted"
                  >
                    Select related fields
                  </label>
                  <select
                    className="form-select border-0 border-bottom rounded-0 px-0"
                    id="relatedFields"
                    name="relatedFields"
                    value={formData.relatedFields}
                    onChange={handleInputChange}
                    style={{
                      boxShadow: "none",
                      borderColor: "#dee2e6 !important",
                    }}
                  >
                    <option value="">Select fields</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                  </select>
                </div>

                {/* Project Cost and Amount Raised Row */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="cost" className="form-label text-muted">
                      Project cost (NGN)
                    </label>
                    <input
                      type="number"
                      className="form-control border-0 border-bottom rounded-0 px-0"
                      id="cost"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      style={{
                        boxShadow: "none",
                        borderColor: "#dee2e6 !important",
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="amountRaised"
                      className="form-label text-muted"
                    >
                      Amount raised (NGN)
                    </label>
                    <input
                      type="number"
                      className="form-control border-0 border-bottom rounded-0 px-0"
                      id="amountRaised"
                      name="amountRaised"
                      value={formData.amountRaised}
                      onChange={handleInputChange}
                      style={{
                        boxShadow: "none",
                        borderColor: "#dee2e6 !important",
                      }}
                    />
                  </div>
                </div>

                {/* Project Manager's Email */}
                <div className="mb-5">
                  <label
                    htmlFor="managerEmail"
                    className="form-label text-muted"
                  >
                    Project manager's email
                  </label>
                  <input
                    type="email"
                    className="form-control border-0 border-bottom rounded-0 px-0"
                    id="managerEmail"
                    name="managerEmail"
                    value={formData.managerEmail}
                    onChange={handleInputChange}
                    style={{
                      boxShadow: "none",
                      borderColor: "#dee2e6 !important",
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-between pt-4">
                  <button
                    type="button"
                    className="btn btn-outline-success px-4 py-2"
                  >
                    Exit
                  </button>
                  <button type="submit" className="btn btn-dark px-4 py-2">
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Progress Sidebar */}
          <div className="col-lg-4">
            <div className="position-sticky" style={{ top: "2rem" }}>
              {/* Add Past Project Link */}
              <div className="text-end mb-4">
                <a href="#" className="text-decoration-none text-muted">
                  Add past project
                </a>
              </div>

              {/* Progress Steps */}
              <div className="bg-white rounded-3 p-4 shadow-sm">
                <div className="list-group list-group-flush">
                  {progressSteps.map((step, index) => (
                    <div
                      key={index}
                      className="list-group-item border-0 px-0 py-3"
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {step.completed ? (
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: "#198754",
                                color: "white",
                                fontSize: "12px",
                              }}
                            >
                              ✓
                            </div>
                          ) : (
                            <div
                              className="rounded-circle border"
                              style={{
                                width: "24px",
                                height: "24px",
                                borderColor: "#dee2e6",
                              }}
                            />
                          )}
                        </div>
                        <span
                          className={
                            step.completed
                              ? "text-success fw-medium"
                              : "text-muted"
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
        </div>
      </div>
    </div>
  );
};
export default CreateProject;

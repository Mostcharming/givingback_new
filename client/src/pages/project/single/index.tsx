import { ChevronRight, Plus, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../assets/images/logo.png";
import place from "../../../assets/images/project.png";

import Loading from "../../../components/home/loading";
import { getStatusBadgeProps } from "../../../helper";
import useBackendService from "../../../services/backend_service";
import { capitalizeFirstLetter } from "../../../services/capitalize";
import { useContent } from "../../../services/useContext";

const ProjectViewDetail: React.FC<any> = () => {
  const [project, setProject] = useState<any>({});
  const { id } = useParams<{ id: string }>();
  const { authState, currentState } = useContent();

  const navigate = useNavigate();
  const role = authState.user?.role;

  const { mutate: getTableData, isLoading } = useBackendService(
    "/allprojects",
    "GET",
    {
      onSuccess: (res: any) => {
        setProject(res.projects[0]);
      },
      onError: () => {
        toast.error("Error getting projects data");
      },
    }
  );

  useEffect(() => {
    getTableData({ projectType: "present", id: id });
  }, [id]);

  const handleBack = () => {
    switch (role) {
      case "admin":
        navigate("/admin/projects");
        break;
      case "donor":
      case "corporate":
        navigate("/donor/projects");
        break;
      case "NGO":
        navigate("/ngo/projects");
        break;
      default:
        console.log("Invalid role or no role found");
    }
  };

  const image = project?.projectImages?.length
    ? project.projectImages[0].image
    : place;
  const badgeProps = project.status
    ? getStatusBadgeProps(project.status)
    : { text: "", backgroundColor: "#ccc", color: "#000" };

  return (
    <div>
      {isLoading && <Loading type={"inline"} />}
      <div className="container-fluid py-4 ">
        <div className="d-flex justify-content-between align-items-center">
          <nav style={{ background: "white" }} aria-label="" className="mb-4">
            <ol style={{ background: "white", display: "flex" }} className="">
              <li className="">
                <a className="text-decoration-none text-muted">Projects </a>
              </li>
              <ChevronRight style={{ marginTop: "1px", width: "1.2rem" }} />
              <li style={{ color: "black" }} className="" aria-current="page">
                {project.title}
              </li>
            </ol>
          </nav>
          <button
            onClick={handleBack}
            type="button"
            className="btn btn-outline-success px-3 py-2"
          >
            Go Back
          </button>
        </div>
      </div>

      <div className="container-fluid px-4">
        <div className="row">
          <div className="col-lg-8">
            <div className="position-relative mb-4">
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

            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center">
                <Image
                  src={logo}
                  alt="Person drinking from water tap"
                  width={50}
                  height={50}
                  className="bg-white rounded-circle m-2"
                />
                <div>
                  <h2 className="h4 mb-1">
                    {capitalizeFirstLetter(project.title)}
                  </h2>
                  <p className="text-muted mb-0">{currentState.user.name}</p>
                </div>
              </div>
              <button className="btn btn-success btn-sm">
                <Share2 size={16} />
              </button>
            </div>

            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <a
                  className="nav-link active text-success border-success"
                  href="#"
                >
                  Details
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-muted" href="#">
                  Updates
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-muted" href="#">
                  Media
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-muted" href="#">
                  Transactions
                </a>
              </li>
            </ul>

            <div className="mb-5">
              <h3 className="h5 mb-3">Project overview</h3>
              <p className="text-muted mb-3">
                This community health initiative aims to improve healthcare
                access for underserved rural communities through mobile clinics,
                medical equipment donations, and healthcare education programs.
                We're partnering with local clinics to expand their reach and
                provide essential services.
              </p>
              <p className="text-muted mb-4">
                Our goal is to serve at least 5,000 individuals who currently
                lack access to basic healthcare services, focusing particularly
                on preventative care and early diagnosis of common conditions.
              </p>

              <h4 className="h6 mb-3">Key objective</h4>
              <ul className="text-muted">
                <li>
                  Establish 3 monthly mobile clinic operations in remote
                  communities
                </li>
                <li>
                  Provide essential medical equipment to 5 existing rural
                  healthcare facilities
                </li>
                <li>
                  Conduct 20 health education workshops focused on preventative
                  care
                </li>
                <li>
                  Train 15 community health workers to provide ongoing support
                </li>
              </ul>
            </div>

            {/* Timeline & Milestones */}
            <div className="mb-5">
              <h3 className="h5 mb-4">Timeline & Milestones</h3>

              {/* Completed Milestone */}
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div
                    className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <div
                      className="bg-white rounded-circle"
                      style={{ width: "8px", height: "8px" }}
                    ></div>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-success me-2">Completed</span>
                      <span className="text-muted small">0 attached</span>
                    </div>
                  </div>
                  <h5 className="h6 mb-1">
                    Project launch & initial assessment
                  </h5>
                  <p className="text-muted small mb-1">July 18, 2024</p>
                  <p className="text-muted small">
                    Conducted needs assessment in target communities and
                    finalized implementation plan.
                  </p>
                </div>
              </div>

              {/* Pending Approval Milestone */}
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <div
                      className="bg-white rounded-circle"
                      style={{ width: "8px", height: "8px" }}
                    ></div>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-primary me-2">
                        Pending approval
                      </span>
                      <span className="text-muted small">0 attached</span>
                    </div>
                  </div>
                  <h5 className="h6 mb-1">Equipment procurement</h5>
                  <p className="text-muted small mb-1">July 23, 2024</p>
                  <p className="text-muted small">
                    Purchasing and preparing essential medical supplies and
                    equipment for distribution.
                  </p>
                </div>
              </div>

              {/* In Progress Milestone */}
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div
                    className="bg-warning rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <div
                      className="bg-white rounded-circle"
                      style={{ width: "8px", height: "8px" }}
                    ></div>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-warning text-dark me-2">
                        In progress
                      </span>
                    </div>
                  </div>
                  <h5 className="h6 mb-1">First Mobile Clinic Operation</h5>
                  <p className="text-muted small mb-1">August 3, 2024</p>
                  <p className="text-muted small">
                    Launch of first mobile clinic serving the eastern district
                    communities.
                  </p>
                </div>
              </div>

              {/* Upcoming Milestone */}
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div
                    className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <div
                      className="bg-white rounded-circle"
                      style={{ width: "8px", height: "8px" }}
                    ></div>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-secondary me-2">Upcoming</span>
                    </div>
                  </div>
                  <h5 className="h6 mb-1">
                    Project Completion & Impact Report
                  </h5>
                  <p className="text-muted small mb-1">September 18, 2024</p>
                  <p className="text-muted small">
                    Final assessment of project outcomes and reporting to
                    stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Funding Progress */}
            <div className="card mb-4">
              <div className="card-body">
                <h6 className="card-title text-muted mb-3">Funding progress</h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <span className="h4 text-dark">$75,000</span>
                    <span className="text-muted"> of $75,000</span>
                  </div>
                  <span className="text-success fw-bold">100%</span>
                </div>
                <div className="progress mb-4" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: "100%" }}
                  ></div>
                </div>

                <h6 className="text-muted mb-3">Project status</h6>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-dark">2 of 6 milestones</span>
                  <span className="text-success fw-bold">36%</span>
                </div>
                <div className="progress mb-4" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: "36%" }}
                  ></div>
                </div>

                <h6 className="text-muted mb-2">Time remaining</h6>
                <div className="text-dark fw-bold mb-1">0 days</div>
                <div className="text-muted small mb-4">Ended Sept 30, 2024</div>

                <h6 className="text-muted mb-2">Donors</h6>
                <div className="text-dark fw-bold mb-1">
                  198 generous hearts
                </div>
                <div className="text-muted small">Including 3 sponsors</div>
              </div>
            </div>

            {/* Project Details */}
            <div className="card mb-4">
              <div className="card-body">
                <h6 className="card-title mb-3">Project details</h6>

                <div className="mb-3">
                  <div className="text-muted small mb-1">Category</div>
                  <div className="text-dark">Health & Community Support</div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small mb-1">Location</div>
                  <div className="text-dark">Eastern Rural Districts</div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small mb-1">Duration</div>
                  <div className="text-dark">
                    3 months (Jul 18, 2024 - Sept 30, 2024)
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small mb-1">Total budget</div>
                  <div className="text-dark">$89,000</div>
                </div>

                <div className="mb-3">
                  <div className="text-muted small mb-1">Project manager</div>
                  <div className="text-dark">janedoe@gmail.com</div>
                </div>
              </div>
            </div>

            {/* Project Sponsors */}
            <div className="card">
              <div className="card-body">
                <h6 className="card-title mb-3">Project sponsors</h6>

                {/* Sponsor 1 */}
                <div className="d-flex align-items-start mb-3">
                  <div
                    className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <span className="text-white fw-bold">G</span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">GivingBack</div>
                    <div className="text-muted small mb-2">
                      Supporting healthcare initiatives through technology and
                      innovation, with a focus on remote care solutions.
                    </div>
                    <a
                      href="#"
                      className="text-success text-decoration-none small"
                    >
                      Send a message <ChevronRight size={12} className="ms-1" />
                    </a>
                  </div>
                </div>

                {/* Sponsor 2 */}
                <div className="d-flex align-items-start mb-3">
                  <div
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <span className="text-white fw-bold">A</span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">AKSMART 22</div>
                    <div className="text-muted small mb-2">
                      Supporting healthcare initiatives through technology and
                      innovation, with a focus on remote care solutions.
                    </div>
                    <a
                      href="#"
                      className="text-success text-decoration-none small"
                    >
                      Send a message <ChevronRight size={12} className="ms-1" />
                    </a>
                  </div>
                </div>

                {/* Sponsor 3 */}
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <span className="text-white fw-bold">AK</span>
                  </div>
                  <div className="fw-bold">AKSMART 22</div>
                </div>

                <button className="btn btn-success w-100">
                  <Plus size={16} className="me-2" />
                  Add New Sponsor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewDetail;

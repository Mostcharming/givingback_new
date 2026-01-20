/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../../assets/images/logo.png";
import place from "../../../assets/images/project.png";
import Loading from "../../../components/home/loading";
import { getStatusBadgeProps } from "../../../helper";
import useBackendService from "../../../services/backend_service";
import { useContent } from "../../../services/useContext";
import Overview from "./render/Details/Overview";
import Timeline from "./render/Details/TimeLine";
import Main from "./render/main";
import MediaGallery from "./render/media";
import Details from "./render/sidebar/Details";
import Progress from "./render/sidebar/Progress";
import Sponsor from "./render/sidebar/Sponsor";
import Transactions from "./render/transactions";
import MileStoneUpdates from "./render/updates";
import ShareModal from "./ShareModal";

const ProjectViewDetail: React.FC<any> = () => {
  const [project, setProject] = useState<any>({});
  const [activeTab, setActiveTab] = useState("Details");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const { authState, currentState } = useContent();
  const navigate = useNavigate();
  const role = authState.user?.role;

  const TABS =
    role === "NGO"
      ? ["Details", "Updates", "Media", "Transactions"]
      : ["Details", "Updates", "Media"];

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
  }, [id, getTableData]);

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
  const handleMessage = () => {
    switch (role) {
      case "admin":
        navigate("/admin/messages");
        break;
      case "donor":
      case "corporate":
        navigate("/donor/messages");
        break;
      case "NGO":
        navigate("/ngo/messages");
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "Details":
        return (
          <>
            <Overview project={project} />
            <Timeline project={project} />
          </>
        );
      case "Updates":
        return <MileStoneUpdates logo={logo} project={project} role={role} />;
      case "Media":
        return <MediaGallery project={project} role={role} />;
      case "Transactions":
        return <Transactions project={project} />;
      default:
        return null;
    }
  };

  const isDonorOrCorporate = role === "donor" || role === "corporate";

  return (
    <div>
      {isLoading ? (
        <Loading type={"inline"} />
      ) : (
        <>
          {isDonorOrCorporate ? (
            // Donor/Corporate View
            <div className="container-fluid py-4">
              <div>
                <button
                  onClick={handleBack}
                  type="button"
                  className="btn text-decoration-none p-0 mb-3"
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <ChevronLeft style={{ width: "1.2rem", height: "1.2rem" }} />
                  Back to Briefs
                </button>
              </div>
              <div className="mb-5">
                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                  }}
                >
                  {project.title}
                </h1>
                <p
                  style={{
                    fontSize: "1.1rem",
                    color: "#666",
                    lineHeight: "1.6",
                  }}
                >
                  {project.description}
                </p>
              </div>
            </div>
          ) : (
            // NGO/Admin View
            <div className="container-fluid py-4">
              <div className="d-flex justify-content-between align-items-center">
                <nav style={{ background: "white" }} className="mb-4">
                  <ol
                    style={{ background: "white", display: "flex" }}
                    className=""
                  >
                    <li>
                      <a className="text-decoration-none text-muted">
                        Projects
                      </a>
                    </li>
                    <ChevronRight
                      style={{ marginTop: "1px", width: "1.2rem" }}
                    />
                    <li style={{ color: "black" }} aria-current="page">
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
          )}

          {!isDonorOrCorporate && (
            <div className="container-fluid px-4">
              <div className="row">
                <div className="col-lg-8">
                  <Main
                    image={image}
                    badgeProps={badgeProps}
                    logo={logo}
                    project={project}
                    currentState={currentState}
                  />

                  {/* Tab Navigation */}
                  <ul
                    style={{ width: "80vw" }}
                    className="nav nav-tabs mb-4 border-bottom border-2"
                  >
                    {TABS.map((tab) => (
                      <li className="nav-item" key={tab}>
                        <button
                          onClick={() => setActiveTab(tab)}
                          className={`nav-link border-0 ${
                            activeTab === tab ? "text-success " : "text-muted"
                          }`}
                        >
                          <span
                            style={{
                              background: "transparent",
                              borderBottom:
                                activeTab === tab ? "4px solid #198754" : "",
                            }}
                          >
                            {tab}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {renderTabContent()}
                </div>

                <div className="col-lg-4">
                  {activeTab === "Details" ? (
                    <>
                      <Progress project={project} />
                      <Details
                        authState={authState}
                        currentUser={currentState}
                        project={project}
                      />
                      {role === "NGO" && (
                        <Sponsor
                          handleMessage={handleMessage}
                          logo={logo}
                          project={project}
                        />
                      )}
                    </>
                  ) : (
                    <Progress project={project} />
                  )}
                </div>
              </div>

              {/* Support Card for Donors and Corporate */}
              {(role === "donor" || role === "corporate") && (
                <div className="row mt-5 mb-4">
                  <div className="col">
                    <div
                      style={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "12px",
                        padding: "40px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* Left side text */}
                      <div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            lineHeight: "1.2",
                            marginBottom: "5px",
                          }}
                        >
                          Support this project
                        </div>
                        <div
                          style={{
                            color: "#666",
                          }}
                        >
                          Help make a lasting impact
                        </div>
                      </div>

                      {/* Right side buttons */}
                      <div style={{ display: "flex", gap: "15px" }}>
                        <button
                          type="button"
                          className="btn btn-outline-dark px-4 py-2"
                          style={{ borderRadius: "6px" }}
                          onClick={() => setShareModalOpen(true)}
                        >
                          Share
                        </button>
                        <button
                          type="button"
                          className="btn btn-success px-4 py-2"
                          style={{ borderRadius: "6px" }}
                        >
                          Donate Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      <ShareModal
        isOpen={shareModalOpen}
        toggle={() => setShareModalOpen(!shareModalOpen)}
      />
    </div>
  );
};

export default ProjectViewDetail;

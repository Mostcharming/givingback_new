/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import place from "../../../assets/images/home//GivingBackNG-logo.svg";
import logo from "../../../assets/images/logo.png";
import Loading from "../../../components/home/loading";
import { getStatusBadgeProps } from "../../../helper";
import useBackendService from "../../../services/backend_service";
import { useContent } from "../../../services/useContext";
import Overview from "./render/Details/Overview";
import Timeline from "./render/Details/TimeLine";
import DonorCorporateView from "./render/DonorCorporateView";
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
  const [activeMilestoneTab, setActiveMilestoneTab] = useState<number | null>(
    null,
  );
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
        const matchedProject = res.projects.find(
          (project: any) => project.id === Number(id),
        );
        setProject(matchedProject);
      },
      onError: () => {
        toast.error("Error getting projects data");
      },
    },
  );

  useEffect(() => {
    const params: any = {
      // projectType: "present",
      id: id,
    };

    if (role === "NGO") {
      params.organization_id = currentState.user.id;
    }

    getTableData(params);
  }, [id, getTableData, role]);

  // Reset milestone tab when Updates tab is activated
  useEffect(() => {
    if (activeTab === "Updates") {
      setActiveMilestoneTab(0);
    }
  }, [activeTab]);

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
        return (
          <div>
            {/* Milestone Tabs */}
            {project?.milestones && project.milestones.length > 0 && (
              <>
                <div className="tab-container" style={{ marginBottom: "24px", flexDirection: "column" }}>
                  <div className="tab-wrapper" style={{ width: "70vw" }}>
                    {project.milestones.map((milestone: any, index: number) => (
                      <button
                        key={milestone.id}
                        onClick={() => setActiveMilestoneTab(index)}
                        className={`tab-button ${
                          activeMilestoneTab === index ? "tab-active" : ""
                        }`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {milestone.milestone}
                      </button>
                    ))}
                  </div>
                </div>
                <MileStoneUpdates logo={logo} project={project} role={role} />
              </>
            )}
            {!project?.milestones ||
              (project.milestones.length === 0 && (
                <MileStoneUpdates logo={logo} project={project} role={role} />
              ))}
          </div>
        );
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
            <DonorCorporateView
              project={project}
              onBack={handleBack}
              onShare={() => setShareModalOpen(true)}
            />
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
                    className="nav nav-tabs mb-2 border-bottom border-2"
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

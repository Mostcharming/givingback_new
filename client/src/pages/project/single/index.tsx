import { ChevronRight } from "lucide-react";
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
import Details from "./render/sidebar/Details";
import Progress from "./render/sidebar/Progress";
import Sponsor from "./render/sidebar/Sponsor";

const TABS = ["Details", "Updates", "Media", "Transactions"];

const ProjectViewDetail: React.FC<any> = () => {
  const [project, setProject] = useState<any>({});
  const [activeTab, setActiveTab] = useState("Details");

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
        return <div>Updates content here</div>;
      case "Media":
        return <div>Media content here</div>;
      case "Transactions":
        return <div>Transactions content here</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading type={"inline"} />
      ) : (
        <>
          {" "}
          <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center">
              <nav style={{ background: "white" }} className="mb-4">
                <ol
                  style={{ background: "white", display: "flex" }}
                  className=""
                >
                  <li>
                    <a className="text-decoration-none text-muted">Projects</a>
                  </li>
                  <ChevronRight style={{ marginTop: "1px", width: "1.2rem" }} />
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
                <ul className="nav nav-tabs mb-4 border-bottom border-2">
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
                    <Sponsor
                      handleMessage={handleMessage}
                      logo={logo}
                      project={project}
                    />
                  </>
                ) : (
                  <Progress project={project} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectViewDetail;

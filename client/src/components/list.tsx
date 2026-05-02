/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, FileText, FolderOpenDot, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";
import "./emptyProject.css";
import Loading from "./home/loading";
import { ProjectItem } from "./ProjectItemCard";

const List = ({ type }) => {
  const { authState } = useContent();
  const [responseData, setResponseData] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [pastProjects, setPastProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Active");
  const role = authState.user?.role;
  // const [statusFilter, setStatusFilter] = useState("All Projects");
  // const [categoryFilter, setCategoryFilter] = useState("All Categories");
  // const [dateFilter, setDateFilter] = useState("Any time");
  // const [locationFilter, setLocationFilter] = useState("All locations");
  // const [areas, setAreas] = useState([]);
  // const { mutate: getAreas } = useBackendService("/areas", "GET", {
  //   onSuccess: (res2: any) => {
  //     setAreas(res2 as any[]);
  //   },
  //   onError: () => {},
  // });

  // useEffect(() => {
  //   getAreas({});
  // }, []);

  // Fetch Active Projects for NGO
  const { mutate: fetchActiveProjects, isLoading: isLoadingActive } =
    useBackendService("/ngo/projects/active", "GET", {
      onSuccess: (res: any) => {
        setActiveProjects(res.projects || []);
      },
      onError: () => {
        toast.error("Failed to fetch active projects.");
        setActiveProjects([]);
      },
    });

  // Fetch Completed Projects for NGO
  const { mutate: fetchCompletedProjects, isLoading: isLoadingCompleted } =
    useBackendService("/ngo/projects/completed", "GET", {
      onSuccess: (res: any) => {
        setCompletedProjects(res.projects || []);
      },
      onError: () => {
        toast.error("Failed to fetch completed projects.");
        setCompletedProjects([]);
      },
    });

  // Fetch Past Projects for NGO
  const { mutate: fetchPastProjects, isLoading: isLoadingPast } =
    useBackendService("/ngo/projects/past", "GET", {
      onSuccess: (res: any) => {
        setPastProjects(res.projects || []);
      },
      onError: () => {
        toast.error("Failed to fetch past projects.");
        setPastProjects([]);
      },
    });

  // Fetch Applications for NGO
  const { mutate: fetchApplications, isLoading: isLoadingApplications } =
    useBackendService("/ngo/projects/applications", "GET", {
      onSuccess: (res: any) => {
        setApplications(res.projects || []);
      },
      onError: () => {
        toast.error("Failed to fetch applications.");
        setApplications([]);
      },
    });

  // Determine if loading
  const isLoading =
    isLoadingActive ||
    isLoadingCompleted ||
    isLoadingPast ||
    isLoadingApplications;
  // useEffect(() => {
  //   const isDefault =
  //     statusFilter === "All Projects" &&
  //     categoryFilter === "All Categories" &&
  //     dateFilter === "Any time" &&
  //     locationFilter === "All locations";

  //   if (isDefault) {
  //     if (role === "NGO") {
  //       fetchUsers({
  //         page: 1,
  //         organization_id: currentState.user.id,
  //       });
  //     } else if (role === "donor" || role === "corporate") {
  //       fetchUsers({
  //         page: 1,
  //         projectType: "present",
  //         status: "active",
  //       });
  //     }
  //     return;
  //   }
  //   if (role === "NGO") {
  //     fetchUsers({
  //       page: currentPage,
  //       category:
  //         categoryFilter !== "All Categories" ? categoryFilter : undefined,
  //       status: statusFilter !== "All Projects" ? statusFilter : undefined,
  //       startDate: dateFilter !== "Any time" ? dateFilter : undefined,
  //       organization_id: currentState.user.id,
  //     });
  //   } else if (role === "donor" || role === "corporate") {
  //     fetchUsers({
  //       page: currentPage,
  //       category:
  //         categoryFilter !== "All Categories" ? categoryFilter : undefined,
  //       status: statusFilter !== "All Projects" ? statusFilter : undefined,
  //       projectType: "present",
  //       startDate: dateFilter !== "Any time" ? dateFilter : undefined,
  //       state: locationFilter !== "All locations" ? locationFilter : undefined,
  //     });
  //   }
  // }, [
  //   currentPage,
  //   statusFilter,
  //   categoryFilter,
  //   dateFilter,
  //   locationFilter,
  //   role,
  // ]);

  // Load data for Active tab
  useEffect(() => {
    if (
      activeTab === "Active" &&
      activeProjects.length === 0 &&
      role === "NGO"
    ) {
      fetchActiveProjects({});
    }
  }, [activeTab, role, activeProjects.length, fetchActiveProjects]);

  // Load data for Completed tab
  useEffect(() => {
    if (
      activeTab === "Completed" &&
      completedProjects.length === 0 &&
      role === "NGO"
    ) {
      fetchCompletedProjects({});
    }
  }, [activeTab, role, completedProjects.length, fetchCompletedProjects]);

  // Load data for Past tab
  useEffect(() => {
    if (activeTab === "Past" && pastProjects.length === 0 && role === "NGO") {
      fetchPastProjects({});
    }
  }, [activeTab, role, pastProjects.length, fetchPastProjects]);

  // Load data for Applications tab
  useEffect(() => {
    if (
      activeTab === "Applications" &&
      applications.length === 0 &&
      role === "NGO"
    ) {
      fetchApplications({});
    }
  }, [activeTab, role, applications.length, fetchApplications]);

  // Update responseData to show the correct tab's data
  useEffect(() => {
    if (role === "NGO") {
      if (activeTab === "Active") {
        setResponseData(activeProjects);
      } else if (activeTab === "Completed") {
        setResponseData(completedProjects);
      } else if (activeTab === "Past") {
        setResponseData(pastProjects);
      } else if (activeTab === "Applications") {
        setResponseData(applications);
      }
    } else if (role === "donor" || role === "corporate") {
      if (activeTab === "Active") {
        setResponseData(activeProjects);
      } else if (activeTab === "Completed") {
        setResponseData(completedProjects);
      } else if (activeTab === "Past") {
        setResponseData(pastProjects);
      } else if (activeTab === "Applications") {
        setResponseData(applications);
      }
    }
  }, [
    activeTab,
    activeProjects,
    completedProjects,
    pastProjects,
    applications,
    role,
  ]);

  const handleAddProject = () => {
    switch (role) {
      case "admin":
        navigate("/admin/projects/brief_initiate");
        break;
      case "donor":
      case "corporate":
        navigate("/donor/brief_initiate");
        break;
      case "NGO":
        navigate("/ngo/projects/brief_initiate");
        break;
      default:
        console.log("Invalid role or no role found");
    }
  };

  return (
    <div className=" p-4">
      <div className="row align-items-center mb-5">
        <div className="col">
          <h3 className="text-custom-green fs-2 fw-semibold mb-0">Projects</h3>
        </div>
        <div className="col-auto">
          {role === "NGO" && activeTab === "Past" && (
            <button
              onClick={handleAddProject}
              className="btn btn-custom-green px-4 py-2 fw-medium rounded-lg"
            >
              Add past project
            </button>
          )}
        </div>
      </div>
      <div className="pb-5">
        {isLoading && <Loading type={"inline"} />}
        {!isLoading && (
          <>
            {/* <ProjectFilters
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              dateFilter={dateFilter}
              areas={areas}
              role={role}
              onStatusChange={setStatusFilter}
              onCategoryChange={setCategoryFilter}
              onDateChange={setDateFilter}
              locationFilter={locationFilter}
              onLocationChange={setLocationFilter}
            /> */}
            {/* Tab Navigation */}
            <div className="tab-container" style={{ marginBottom: "24px" }}>
              <div className="tab-wrapper" style={{ width: "70vw" }}>
                {["Active", "Completed", "Past", "Applications"].map((tab) => {
                  const getIcon = () => {
                    if (tab === "Active")
                      return (
                        <FileText size={14} style={{ marginRight: "4px" }} />
                      );
                    if (tab === "Completed")
                      return (
                        <CheckCircle size={14} style={{ marginRight: "4px" }} />
                      );
                    if (tab === "Past")
                      return (
                        <CheckCircle size={14} style={{ marginRight: "4px" }} />
                      );
                    if (tab === "Applications")
                      return <Send size={14} style={{ marginRight: "4px" }} />;
                    return null;
                  };

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`tab-button ${
                        activeTab === tab ? "tab-active" : ""
                      }`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getIcon()}
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {responseData.length === 0 ? (
              <div
                style={{ marginTop: "200px" }}
                className="row justify-content-center"
              >
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="text-center empty-state-container">
                    <div className="mb-4">
                      <FolderOpenDot className="text-custom-muted" size={50} />
                    </div>
                    <h2 className="text-custom-dark fs-4 fw-semibold mb-3">
                      No projects yet
                    </h2>
                    {role === "NGO" && (
                      <p className="text-custom-muted mb-5 lh-base">
                        You don't seem to have an projects available yet. When
                        you add a project, it would appear here.
                      </p>
                    )}{" "}
                    {role !== "NGO" && (
                      <p className="text-custom-muted mb-5 lh-base">
                        There are currently no projects available.
                      </p>
                    )}
                    {role === "NGO" && activeTab === "Past" && (
                      <button
                        onClick={handleAddProject}
                        className="btn btn-custom-green w-100 px-4 py-3 fw-medium rounded-lg"
                      >
                        Add past project
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div
                // style={{
                //   maxWidth: "1200px",
                //   margin: "0 auto",
                //   padding: "0 16px",
                // }}
                >
                  {responseData.map((project) => {
                    // if (type === "past") {
                    const img = project.projectImages[0]?.image;
                    // }
                    return (
                      <div key={project.id} style={{ marginBottom: "24px" }}>
                        <ProjectItem
                          type={type}
                          project={project}
                          image={img}
                          activeTab={activeTab}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default List;

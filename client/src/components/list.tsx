/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, FileText, FolderOpenDot, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";
import "./emptyProject.css";
import Loading from "./home/loading";
import { ProjectItem } from "./ProjectItemCard";

const List = ({ type }) => {
  const { authState, currentState } = useContent();
  const [responseData, setResponseData] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [pastProjects, setPastProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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

  const [fetchingTab, setFetchingTab] = useState<string | null>(null);

  const { mutate: fetchUsers, isLoading } = useBackendService(
    "/allprojects",
    "GET",
    {
      onSuccess: (res: any) => {
        const projects = res.projects;
        setTotalProjects(res.totalItems || 0);
        setTotalPages(res.totalPages || 1);

        // Store data in the appropriate tab state
        if (fetchingTab === "Active") {
          setActiveProjects(projects);
        } else if (fetchingTab === "Completed") {
          setCompletedProjects(projects);
        } else if (fetchingTab === "Past") {
          setPastProjects(projects);
        } else if (fetchingTab === "Applications") {
          setApplications(projects);
        }

        setResponseData(projects);
      },
      onError: () => {
        toast.error("Failed to fetch Projects.");
      },
    },
  );
  useEffect(() => {
    if (type === "past") {
      setFetchingTab("Past");
      fetchUsers({
        page: currentPage,
        projectType: "previous",
        organization_id: currentState.user.id,
      });
    } else {
      if (role === "NGO") {
        setFetchingTab("Active");
        fetchUsers({
          page: currentPage,
          limit: 20,
          organization_id: currentState.user.id,
        });
      } else if (role === "donor" || role === "corporate") {
        setFetchingTab("Active");
        fetchUsers({
          page: currentPage,
          projectType: "present",
          status: "active",
        });
      }
    }
  }, [role]);
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
    if (activeTab === "Active" && activeProjects.length === 0) {
      setFetchingTab("Active");
      if (role === "NGO") {
        fetchUsers({
          page: 1,
          organization_id: currentState.user.id,
        });
      } else if (role === "donor" || role === "corporate") {
        fetchUsers({
          page: 1,
          projectType: "present",
          status: "active",
        });
      }
    }
  }, [
    activeTab,
    role,
    currentState.user.id,
    fetchUsers,
    activeProjects.length,
  ]);

  // Load data for Completed tab
  useEffect(() => {
    if (activeTab === "Completed" && completedProjects.length === 0) {
      setFetchingTab("Completed");
      fetchUsers({
        page: 1,
        projectType: "completed",
        organization_id: currentState.user.id,
      });
    }
  }, [activeTab, currentState.user.id, fetchUsers, completedProjects.length]);

  // Load data for Past tab
  useEffect(() => {
    if (activeTab === "Past" && pastProjects.length === 0) {
      setFetchingTab("Past");
      fetchUsers({
        page: 1,
        projectType: "previous",
        organization_id: currentState.user.id,
      });
    }
  }, [activeTab, currentState.user.id, fetchUsers, pastProjects.length]);

  // Load data for Applications tab
  useEffect(() => {
    if (activeTab === "Applications" && applications.length === 0) {
      setFetchingTab("Applications");
      fetchUsers({
        page: 1,
        projectType: "present",
        organization_id: currentState.user.id,
      });
    }
  }, [activeTab, currentState.user.id, fetchUsers, applications.length]);

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
  const nextPage = () => {
    if (currentPage * 6 < totalProjects) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
          {role === "NGO" && (
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
                    {role === "NGO" && (
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
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    style={{
                      backgroundColor: currentPage === 1 ? "grey" : "#7B80DD",
                      color: "white",
                      border: "none",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                    onClick={previousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    style={{
                      backgroundColor:
                        currentPage === totalPages ? "grey" : "#7B80DD",
                      color: "white",
                      border: "none",
                      cursor:
                        currentPage === totalPages ? "not-allowed" : "pointer",
                    }}
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
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

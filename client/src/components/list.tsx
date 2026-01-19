/* eslint-disable @typescript-eslint/no-explicit-any */
import { FolderOpenDot } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Container, Row } from "reactstrap";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";
import "./emptyProject.css";
import Loading from "./home/loading";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectItem } from "./ProjectItemCard";

const List = ({ type }) => {
  const { authState, currentState } = useContent();
  const [responseData, setResponseData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("All Projects");
  const role = authState.user?.role;
  const [statusFilter, setStatusFilter] = useState("All Projects");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("Any time");
  const [locationFilter, setLocationFilter] = useState("All locations");
  const [areas, setAreas] = useState([]);
  const { mutate: getAreas } = useBackendService("/areas", "GET", {
    onSuccess: (res2: any) => {
      setAreas(res2 as any[]);
    },
    onError: () => {},
  });

  useEffect(() => {
    getAreas({});
  }, []);

  const { mutate: fetchUsers, isLoading } = useBackendService(
    "/allprojects",
    "GET",
    {
      onSuccess: (res: any) => {
        setResponseData(res.projects);
        setTotalProjects(res.totalItems || 0);
        setTotalPages(res.totalPages || 1);
      },
      onError: () => {
        toast.error("Failed to fetch Projects.");
      },
    }
  );
  useEffect(() => {
    if (type === "past") {
      fetchUsers({
        page: currentPage,
        projectType: "previous",
        organization_id: currentState.user.id,
      });
    } else {
      if (role === "NGO") {
        fetchUsers({
          page: currentPage,
          projectType: "present",
          status: "active",
          organization_id: currentState.user.id,
        });
      } else {
        fetchUsers({
          page: currentPage,
          projectType: "present",
          status: "active",
          // donor_id: currentState.user.id,
        });
      }
    }
  }, []);
  useEffect(() => {
    const isDefault =
      statusFilter === "All Projects" &&
      categoryFilter === "All Categories" &&
      dateFilter === "Any time" &&
      locationFilter === "All locations";

    const baseQuery = {
      page: 1,
      projectType: "present",
      status: "active",
      // organization_id: currentState.user.id,
    };

    if (isDefault) {
      fetchUsers(baseQuery);
      return;
    }
    if (role === "NGO") {
      fetchUsers({
        page: currentPage,
        category:
          categoryFilter !== "All Categories" ? categoryFilter : undefined,
        projectType: "present",
        status: statusFilter !== "All Projects" ? statusFilter : undefined,

        startDate: dateFilter !== "Any time" ? dateFilter : undefined,
        organization_id: currentState.user.id,
      });
      // eslint-disable-next-line no-constant-condition
    } else if (role === "donor" || "corporate") {
      fetchUsers({
        page: currentPage,
        category:
          categoryFilter !== "All Categories" ? categoryFilter : undefined,
        status: statusFilter !== "All Projects" ? statusFilter : undefined,

        projectType: "present",
        startDate: dateFilter !== "Any time" ? dateFilter : undefined,
        state: locationFilter !== "All locations" ? locationFilter : undefined,
        // donor_id: currentState.user.id,
      });
    }
  }, [currentPage, statusFilter, categoryFilter, dateFilter, locationFilter]);

  useEffect(() => {
    if (activeTab === "Contributed to" || activeTab === "Sponsoring") {
      fetchUsers({
        page: currentPage,
        projectType: "present",
        status: "active",
        donor_id: currentState.user.id,
      });
    } else if (activeTab === "All Projects") {
      if (role === "NGO") {
        fetchUsers({
          page: currentPage,
          projectType: "present",
          status: "active",
          organization_id: currentState.user.id,
        });
      } else {
        fetchUsers({
          page: currentPage,
          projectType: "present",
          status: "active",
        });
      }
    }
  }, [activeTab, currentPage, currentState.user.id, fetchUsers, role]);
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
            <ProjectFilters
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
            />
            {/* Tab Navigation */}
            <div style={{ marginLeft: "-1.5rem", marginRight: "-1.5rem" }}>
              <ul
                className="nav nav-tabs mt-4 border-bottom border-2"
                style={{
                  paddingLeft: "1.5rem",
                  paddingRight: "1.5rem",
                  marginBottom: "-2px",
                }}
              >
                {["All Projects", "Contributed to", "Sponsoring"].map((tab) => (
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
                            activeTab === tab ? "2px solid #198754" : "",
                          paddingBottom: "8px",
                          display: "inline-block",
                        }}
                      >
                        {tab}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
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
                <Container style={{ maxWidth: "unset" }}>
                  <Row>
                    {responseData.map((project) => {
                      // if (type === "past") {
                      const img = project.projectImages[0]?.image;
                      // }
                      return (
                        <ProjectItem
                          type={type}
                          project={project}
                          image={img}
                          key={project.id}
                        />
                      );
                    })}
                  </Row>
                </Container>

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

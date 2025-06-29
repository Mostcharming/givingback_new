import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { Button, Col, Container, Row } from "reactstrap";
import place from "../assets/images/project.png";

import { FolderOpenDot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getStatusBadgeProps } from "../helper";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";
import "./emptyProject.css";
import Loading from "./home/loading";

export const ProjectItem = (props: any) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { authState } = useContent();
  const role = authState.user?.role;

  const enter = (event: React.MouseEvent<HTMLDivElement>) => setShow(true);
  const leave = (event: React.MouseEvent<HTMLDivElement>) => setShow(false);

  const details = () => {
    if (props.type === "past") {
      switch (role) {
        case "NGO":
          navigate(`/ngo/project/${props.project.id}`);
          break;
        default:
          console.log("Invalid role or no role found");
      }
    } else {
      switch (role) {
        case "admin":
          navigate(`/admin/project/${props.project.id}`);
          break;
        case "donor":
        case "corporate":
          navigate(`/donor/project/${props.project.id}`);
          break;
        case "NGO":
          navigate(`/ngo/project/${props.project.id}`);
          break;
        default:
          console.log("Invalid role or no role found");
      }
    }
  };

  const image = props.image ? `${props.image}` : place;
  const badgeProps = getStatusBadgeProps(props.project.status);
  const cost = props.project.cost ?? props.project.allocated ?? 0;

  const totalMilestones = props.project.milestones?.length || 0;
  const completedMilestones =
    props.project.milestones?.filter((m) =>
      m.updates?.some((u) => u.status?.toLowerCase() === "completed")
    ).length || 0;
  const completedMilestoneTargets =
    props.project.milestones
      ?.filter((m) =>
        m.updates?.some((u) => u.status?.toLowerCase() === "completed")
      )
      .reduce((sum, m) => sum + (m.target || 0), 0) || 0;

  const progressPercent = totalMilestones
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  });
  return (
    <Col className="px-3 mt-4" lg={4}>
      <div
        onMouseEnter={enter}
        onMouseLeave={leave}
        onClick={details}
        className="card shadow-sm rounded"
        style={{ cursor: "pointer", maxWidth: "600px", margin: "0 auto" }}
      >
        <div className="position-relative">
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

        <div className="card-body p-4">
          <h2 className="card-title h3 fw-bold text-dark mb-3">
            {props.project.title}
          </h2>

          <p
            className="card-text text-muted mb-4"
            style={{ fontSize: "16px", lineHeight: "1.5" }}
          >
            {props.project.description}
          </p>

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted" style={{ fontSize: "16px" }}>
                Progress
              </span>
              <span
                className="fw-bold text-success"
                style={{ fontSize: "18px" }}
              >
                {progressPercent} %
              </span>
            </div>

            <div
              className="progress"
              style={{ height: "8px", backgroundColor: "#e9ecef" }}
            >
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={76}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="h5 fw-bold text-dark mb-0">
                {formatter.format(completedMilestoneTargets)}
              </span>{" "}
              <span className="text-muted ms-1"> raised</span>
            </div>
            <div className="text-muted">
              Goal:{" "}
              <span className="fw-semibold">{formatter.format(cost)}</span>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

const List = ({ type }) => {
  const { authState, currentState } = useContent();
  const [responseData, setResponseData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const role = authState.user?.role;
  const [statusFilter, setStatusFilter] = useState("All Projects");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("Any time");

  const { mutate: fetchUsers, isLoading } = useBackendService(
    "/allprojects",
    "GET",
    {
      onSuccess: (res: any) => {
        if (
          statusFilter !== "All Projects" ||
          categoryFilter !== "All Categories" ||
          dateFilter !== "Any time"
        ) {
          if (res.totalItems === 0) {
            toast.info("No projects found with the selected filters.");
          }
        } else {
          setResponseData(res.projects);
          setTotalProjects(res.totalItems || 0);
          setTotalPages(res.totalPages || 1);
        }
      },
      onError: (error) => {
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
          donor_id: currentState.user.id,
        });
      }
    }
  }, []);
  useEffect(() => {
    const isDefault =
      statusFilter === "All Projects" &&
      categoryFilter === "All Categories" &&
      dateFilter === "Any time";

    const baseQuery = {
      page: 1,
      projectType: "present",
      status: "active",
      organization_id: currentState.user.id,
    };

    if (isDefault) {
      fetchUsers(baseQuery);
      return;
    }
    if (role === "NGO") {
      fetchUsers({
        page: currentPage,
        category: statusFilter !== "All Projects" ? statusFilter : undefined,
        projectType: "present",
        startDate: dateFilter !== "Any time" ? dateFilter : undefined,
        organization_id: currentState.user.id,
      });
      // eslint-disable-next-line no-constant-condition
    } else if (role === "donor" || "corporate") {
      fetchUsers({
        page: currentPage,
        category: statusFilter !== "All Projects" ? statusFilter : undefined,
        projectType: "present",
        startDate: dateFilter !== "Any time" ? dateFilter : undefined,
        donor_id: currentState.user.id,
      });
    }
  }, [currentPage, statusFilter, categoryFilter, dateFilter]);

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
    toast.success("🎉 Project added successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="min-vh-100 p-4">
      <div className="container-fluid">
        <div className="row align-items-center mb-5">
          <div className="col">
            <h3 className="text-custom-green fs-2 fw-semibold mb-0">
              Projects
            </h3>
          </div>
          <div className="col-auto">
            <button
              onClick={handleAddProject}
              className="btn btn-custom-green px-4 py-2 fw-medium rounded-lg"
            >
              Add Project
            </button>
          </div>
        </div>
        <div className="pb-5">
          {isLoading && <Loading type={"inline"} />}
          {responseData.length === 0 && !isLoading && (
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

                  <p className="text-custom-muted mb-5 lh-base">
                    You don't seem to have an projects available yet. When you
                    add a project, it would appear here.
                  </p>

                  <button
                    onClick={handleAddProject}
                    className="btn btn-custom-green w-100 px-4 py-3 fw-medium rounded-lg"
                  >
                    Add project
                  </button>
                </div>
              </div>
            </div>
          )}
          {responseData.length > 0 && !isLoading && (
            <>
              <div
                style={{
                  border: "1px solid rgb(179, 179, 179)",
                  borderRadius: "10px",
                }}
                className="container-fluid p-3"
              >
                <div className="row">
                  {/* Status Filter */}
                  <div className="mr-2">
                    <div>
                      <label className="form-label text-muted small fw-normal">
                        Status
                      </label>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                        role="button"
                        id="dropdownMenuLink"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid rgb(179, 179, 179)",

                          borderRadius: "8px",
                          padding: "12px 16px",
                        }}
                      >
                        <span>{statusFilter}</span>
                      </button>
                      <ul className="dropdown-menu w-100">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setStatusFilter("All Projects")}
                          >
                            All Projects
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setStatusFilter("active")}
                          >
                            Active
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setStatusFilter("completed")}
                          >
                            Completed
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setStatusFilter("closed")}
                          >
                            Closed
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mr-2">
                    <div>
                      <label className="form-label text-muted small fw-normal">
                        Category
                      </label>
                    </div>
                    <div className="dropdown">
                      <button
                        className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                        role="button"
                        id="dropdownMenuLink"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid rgb(179, 179, 179)",

                          borderRadius: "8px",
                          padding: "12px 16px",
                        }}
                      >
                        <span>{categoryFilter}</span>
                      </button>
                      <ul className="dropdown-menu w-100">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setCategoryFilter("All categories")}
                          >
                            All Categories
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setCategoryFilter("Web Development")}
                          >
                            Web Development
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setCategoryFilter("Mobile App")}
                          >
                            Mobile App
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setCategoryFilter("Design")}
                          >
                            Design
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setCategoryFilter("Marketing")}
                          >
                            Marketing
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div className="">
                    <div>
                      <label className="form-label text-muted small fw-normal">
                        Date
                      </label>
                    </div>
                    <input
                      type="date"
                      className="form-control"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      style={{
                        backgroundColor: "white",
                        border: "1px solid rgb(179, 179, 179)",
                        borderRadius: "8px",
                        padding: "24px 16px",
                      }}
                    />
                  </div>
                </div>
                <div className="row"></div>
              </div>

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
        </div>
      </div>
    </div>
  );
};

export default List;

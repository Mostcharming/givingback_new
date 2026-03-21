/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Bookmark,
  Building2,
  Calendar,
  FolderDot,
  MapPin,
  Search,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { ProjectFilters } from "../components/ProjectFilters";
import Loading from "../components/home/loading";
import useBackendService from "../services/backend_service";
import { capitalizeFirstLetter } from "../services/capitalize";

const Briefs = () => {
  const [responseData, setResponseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("Any time");
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

  const { mutate: fetchBriefs, isLoading } = useBackendService(
    "/allprojects",
    "GET",
    {
      onSuccess: (res: any) => {
        setResponseData(res.projects);
        setTotalProjects(res.totalItems || 0);
        setTotalPages(res.totalPages || 1);
      },
      onError: () => {
        toast.error("Failed to fetch Briefs.");
      },
    }
  );

  useEffect(() => {
    fetchBriefs({
      page: currentPage,
      status: "brief",
    });
  }, []);

  useEffect(() => {
    const isDefault =
      categoryFilter === "All Categories" && dateFilter === "Any time";

    if (isDefault) {
      fetchBriefs({
        page: 1,
        status: "brief",
      });
      return;
    }

    fetchBriefs({
      page: currentPage,
      status: "brief",
      category:
        categoryFilter !== "All Categories" ? categoryFilter : undefined,
      startDate: dateFilter !== "Any time" ? dateFilter : undefined,
    });
  }, [currentPage, categoryFilter, dateFilter]);

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

  return (
    <div className="bg-custom-light min-vh-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="p-4">
              {/* Header */}
              <h3
                style={{ color: "#128330" }}
                className=" fs-4 fw-semibold mb-4"
              >
                Briefs
              </h3>

              {isLoading && <Loading type={"inline"} />}

              {!isLoading && responseData.length === 0 ? (
                /* Empty State */
                <div
                  className="d-flex flex-column align-items-center justify-content-center text-center py-5"
                  style={{ minHeight: "60vh" }}
                >
                  {/* Search Icon */}
                  <div className="mb-4">
                    <Search
                      className="text-icon-gray"
                      size={64}
                      strokeWidth={1.5}
                    />
                  </div>

                  <h4 className="text-custom-dark fs-4 fw-semibold mb-3">
                    No Funding Opportunities Available
                  </h4>

                  <div className="col-12 col-md-6 col-lg-8">
                    <p className="text-custom-muted mb-4 lh-base">
                      There are currently no active funding briefs from sponsors
                      or donors. New opportunities will appear here as they
                      become available.
                    </p>
                  </div>

                  <Button
                    className="btn mb-3 px-5 py-3 col-12 col-md-6 col-lg-8"
                    style={{ border: "none", background: "#02a95c" }}
                  >
                    Check again later
                  </Button>

                  {/* Notification Text */}
                  <div className="col-12 col-md-8 col-lg-6"></div>
                </div>
              ) : (
                !isLoading && (
                  <>
                    <ProjectFilters
                      statusFilter="All Projects"
                      categoryFilter={categoryFilter}
                      dateFilter={dateFilter}
                      areas={areas}
                      role="NGO"
                      onStatusChange={() => {}}
                      onCategoryChange={setCategoryFilter}
                      onDateChange={setDateFilter}
                    />

                    <div className="mt-4">
                      {responseData.map((project) => {
                        const truncateDescription = (
                          text: string,
                          maxWords: number = 200
                        ) => {
                          const words = text.split(" ");
                          if (words.length > maxWords) {
                            return words.slice(0, maxWords).join(" ") + "...";
                          }
                          return text;
                        };

                        const displayDescription = truncateDescription(
                          project.description || ""
                        );
                        const isTruncated =
                          (project.description || "").split(" ").length > 200;

                        const formatter = new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        });

                        return (
                          <div
                            key={project.id}
                            className="card shadow-sm rounded mb-3"
                            style={{
                              padding: "24px",
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            {/* Title with Badge */}
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center gap-3">
                                <h5 className="fw-bold mr-2 text-dark mb-0">
                                  {capitalizeFirstLetter(project.title)}
                                </h5>
                                <span
                                  className="rounded-pill px-3 py-1"
                                  style={{
                                    backgroundColor: "#e2efe9",
                                    color: "#128330",
                                    fontSize: "12px",
                                  }}
                                >
                                  New
                                </span>
                              </div>
                              <Bookmark
                                size={24}
                                style={{
                                  cursor: "pointer",
                                  color: "#6c757d",
                                  transition: "color 0.3s ease, fill 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "#128330";
                                  e.currentTarget.style.fill = "#128330";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "#6c757d";
                                  e.currentTarget.style.fill = "none";
                                }}
                              />
                            </div>

                            {/* Description */}
                            <p
                              className="text-muted mb-3"
                              style={{
                                fontSize: "14px",
                                lineHeight: "1.6",
                              }}
                            >
                              {capitalizeFirstLetter(displayDescription)}
                              {isTruncated && (
                                <a
                                  href={`/briefs/${project.id}`}
                                  style={{
                                    color: "#198754",
                                    textDecoration: "underline",
                                    marginLeft: "4px",
                                  }}
                                >
                                  Read more
                                </a>
                              )}
                            </p>

                            {/* Details Grid */}
                            <div
                              style={{
                                fontSize: "14px",
                                marginTop: "16px",
                                marginBottom: "16px",
                              }}
                            >
                              {/* Row 1: Budget, Deadline, Category */}
                              <div
                                className="d-flex mb-3"
                                style={{
                                  justifyContent: "flex-start",
                                  gap: "60px",
                                }}
                              >
                                {/* Budget */}
                                <div
                                  className="d-flex align-items-center gap-2"
                                  style={{ flex: "0 0 auto" }}
                                >
                                  <Wallet
                                    size={18}
                                    style={{ color: "#2c3e50", flexShrink: 0 }}
                                  />
                                  <span className="text-dark ml-2">
                                    <span className="text-muted">Budget: </span>
                                    <span className="fw-semibold">
                                      {formatter.format(project.cost || 0)}
                                    </span>
                                  </span>
                                </div>

                                {/* Deadline */}
                                <div
                                  className="d-flex align-items-center gap-2"
                                  style={{ flex: "0 0 auto" }}
                                >
                                  <Calendar
                                    size={18}
                                    style={{ color: "#2c3e50", flexShrink: 0 }}
                                  />
                                  <span className="text-dark ml-2">
                                    <span className="text-muted">
                                      Deadline:{" "}
                                    </span>
                                    <span className="fw-semibold">
                                      {project.deadline
                                        ? new Date(
                                            project.deadline
                                          ).toLocaleDateString("en-NG")
                                        : "N/A"}
                                    </span>
                                  </span>
                                </div>

                                {/* Category */}
                                <div
                                  className="d-flex align-items-center gap-2"
                                  style={{ flex: "0 0 auto" }}
                                >
                                  <FolderDot
                                    size={18}
                                    style={{ color: "#2c3e50", flexShrink: 0 }}
                                  />
                                  <span className="text-dark ml-2">
                                    <span className="text-muted">
                                      Category:{" "}
                                    </span>
                                    <span className="fw-semibold">
                                      {project.category || "N/A"}
                                    </span>
                                  </span>
                                </div>
                              </div>

                              {/* Row 2: Location, Sponsor */}
                              <div
                                className="d-flex"
                                style={{
                                  justifyContent: "flex-start",
                                  gap: "60px",
                                }}
                              >
                                {/* Location */}
                                <div
                                  className="d-flex align-items-center gap-2"
                                  style={{ flex: "0 0 auto" }}
                                >
                                  <MapPin
                                    size={18}
                                    style={{ color: "#2c3e50", flexShrink: 0 }}
                                  />
                                  <span className="text-dark">
                                    <span className="text-muted">
                                      Location:{" "}
                                    </span>
                                    <span className="fw-semibold">
                                      {project.state || "N/A"}
                                    </span>
                                  </span>
                                </div>

                                {/* Sponsor */}
                                <div
                                  className="d-flex align-items-center gap-2"
                                  style={{ flex: "0 0 auto" }}
                                >
                                  <Building2
                                    size={18}
                                    style={{ color: "#2c3e50", flexShrink: 0 }}
                                  />
                                  <span className="text-dark">
                                    <span className="text-muted">
                                      Sponsor:{" "}
                                    </span>
                                    <span className="fw-semibold">
                                      {project.organization?.name ||
                                        project.organizationName ||
                                        "N/A"}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* See More Button */}
                            <a
                              href={`/ngo/briefs/${project.id}`}
                              style={{
                                color: "#198754",
                                textDecoration: "underline",
                                fontSize: "14px",
                              }}
                            >
                              See more
                            </a>
                          </div>
                        );
                      })}
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <Button
                        style={{
                          backgroundColor:
                            currentPage === 1 ? "grey" : "#7B80DD",
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
                            currentPage === totalPages
                              ? "not-allowed"
                              : "pointer",
                        }}
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Briefs;

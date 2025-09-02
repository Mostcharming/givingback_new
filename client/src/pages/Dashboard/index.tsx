/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Book,
  Circle,
  CircleCheckBig,
  Clock,
  FolderOpenDot,
  Heart,
  House,
  Info,
  Map,
  Mic,
  Plus,
  Send,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import DashBox from "../../components/dashbox";
import { formatDate } from "../../components/formatTime";
import Tables from "../../components/tables";
import useBackendService from "../../services/backend_service";
import { capitalizeFirstLetter } from "../../services/capitalize";
import { useContent } from "../../services/useContext";

const Dashboard = () => {
  const { authState, currentState } = useContent();
  const navigate = useNavigate();
  const [dashBoxItems, setDashBoxItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [actions, setActions] = useState([]);
  const [userBankDetails, setUserBankDetails] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const role = authState.user?.role;

  const isFirstTimeLogin = authState?.user?.first_time_login === 0;
  const hasActiveProject = currentState?.activeProjectsCount > 0;
  const hasBankDetails = currentState?.bank?.length > 0;
  const hasAddress =
    Array.isArray(currentState?.address) && currentState.address.length > 0;

  // Fetching dashboard details
  const { mutate: getDash } = useBackendService("/donor/dashboard", "GET", {
    onSuccess: (res) => {
      const items = getDashBoxItems(role, res);
      setDashBoxItems(items);
    },
    onError: () => {
      toast.error("Error getting Dashboard details");
    },
  });

  const { mutate: getDashAdmin } = useBackendService(
    "/admin/dashboard",
    "GET",
    {
      onSuccess: (res) => {
        const items = getDashBoxItems(role, res);
        setDashBoxItems(items);
      },
      onError: () => {
        toast.error("Error getting Dashboard details");
      },
    }
  );

  // Fetching table data
  const { mutate: getTableData } = useBackendService(
    "/admin/transactions",
    "GET",
    {
      onSuccess: (res: any) => {
        const filteredData =
          res.donations?.map((project: any) => ({
            transactionNo: `Trx-00${project.id}`,
            amount: project.amount,
            type: capitalizeFirstLetter(project.type),
            tstatus: capitalizeFirstLetter(project.status) ?? "Completed",
            dateTime: formatDate(project.createdAt),
          })) || [];

        // Update the table data with filtered data
        setTableData(filteredData);
        setupTableAttributes(role);
      },
      onError: () => {
        setupTableAttributes(role);

        toast.error("Error getting projects data");
      },
    }
  );
  useEffect(() => {
    setUserBankDetails(hasBankDetails);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const formattedDate =
      now.toDateString() === new Date().toDateString()
        ? `Today, ${formattedTime}`
        : `${now.toLocaleDateString()}, ${formattedTime}`;
    setLastUpdated(formattedDate);

    if (role === "admin") {
      getDashAdmin({});
      getTableData({});
    } else if (role === "donor" || role === "corporate") {
      getDash({});
      getTableData({ projectType: "present", donor_id: currentState?.user.id });
    } else if (role === "NGO") {
      getDash({});
      getTableData({
        projectType: "present",
        ngo_id: currentState?.user.id,
      });
    }
  }, []);

  const getDashBoxItems = (role, data: any) => {
    switch (role) {
      case "NGO":
        return [
          {
            title: "Projects Completed",
            amount: data.completedProjectsCount || 0,
            iconClass: <FolderOpenDot />,
            bgColor: "#EDF7ED",
            color: "#128330",
          },
          {
            title: "Active Campaign",
            amount: data.activeProjectsCount,
            iconClass: <Mic />,
            bgColor: "#E8F4FE",
            color: "#2196F3",
          },
          {
            title: "Donations Received",
            amount: data.totalDonations,
            iconClass: <Book />,
            bgColor: "#FFF9E6",
            color: "#FFC107",
          },
          {
            title: "Beneficiries Impacted",
            amount: data.completedProjectsCount * 3,
            iconClass: <Users />,
            bgColor: "#F5E9F7",
            color: "#9C27B0",
          },
        ];
      case "donor":
      case "corporate":
        return [
          {
            title: "Active Projects",
            amount: data.activeProjectsCount || 0,
            iconClass: <FolderOpenDot />,
            bgColor: "#F3F4F6",
            color: "#3B82F6",
          },
          {
            title: "Total Donated",
            amount: data.totalDonations || 0,
            iconClass: <Wallet />,
            bgColor: "#F3F4F6",
            color: "#128330",
          },
          {
            title: "NGO's Patnered",
            amount: data.activeProjectsCount,
            iconClass: <UsersRound />,
            bgColor: "#F3F4F6",
            color: "#9C27B0",
          },
          {
            title: "States Covered",
            amount: data.completedProjectsCount,
            iconClass: <Map />,
            bgColor: "#F3F4F6",
            color: "#3B82F6",
          },
        ];
      case "admin":
        return [
          {
            title: "Number of NGOs",
            amount: data.ngoUsersCount,
            iconClass: <House />,
            bgColor: "bg-success",
          },
          {
            title: "Pending Requests",
            amount: data.pendingRequests,
            iconClass: <House />,
            bgColor: "bg-warning",
          },
          {
            title: "Total Project Funding",
            amount: data.donationCount,
            iconClass: <House />,
            bgColor: "bg-info",
          },
          {
            title: "Number of Projects",
            amount: data.projectCount,
            iconClass: <House />,
            bgColor: "bg-primary",
          },
        ];
      default:
        return [];
    }
  };

  const setupTableAttributes = (role: string) => {
    // Set dynamic headers and actions based on the role
    switch (role) {
      case "NGO":
        setHeaders(["Transaction-No", "Amount", "Type", "Status", "Date-Time"]);
        setActions([
          // {
          //   label: 'View',
          //   onClick: (row) => console.log('View details of', row)
          // }
        ]);
        break;
      case "donor":
      case "corporate":
        setHeaders(["Transaction-No", "Amount", "Type", "Status", "Date-Time"]);
        setActions([
          // {
          //   label: 'View',
          //   onClick: (row) => console.log('View details of', row)
          // }
        ]);
        break;
      case "admin":
        setHeaders([
          "Transaction-No",
          "Amount",
          "Type",
          "Status ",
          "Date-Time",
        ]);
        setActions([
          {
            label: "View",
            onClick: (row) => console.log("View details of", row),
          },
        ]);
        break;
      default:
        setHeaders([]);
        setActions([]);
    }
  };

  const handleEmptyStateClick = () => {
    switch (role) {
      case "admin":
        navigate("/admin/projects"); // Redirect to admin briefs
        break;
      case "donor":
      case "corporate":
        navigate("/donor/projects"); // Redirect to donor briefs
        break;
      case "NGO":
        navigate("/ngo/projects"); // Redirect to NGO briefs
        break;
      default:
        console.log("Invalid role or no role found");
    }
  };

  const renderBreadcrumbs = (role: string) => {
    switch (role) {
      case "NGO":
        return (
          <>
            <Row>
              <p>Welcome, {currentState?.user.name}!</p>
            </Row>
            <Row>
              <h5 style={{ color: "#128330" }} className="font-bold">
                We're glad you are here
              </h5>
            </Row>
          </>
        );
      case "donor":
      case "corporate":
        return (
          <>
            <Row>
              <h4>Welcome to GivingBack, {currentState?.user.name}!</h4>
            </Row>
            <Row>
              <p>Here's your impact at a glance</p>
            </Row>
          </>
        );
      case "admin":
        return (
          <>
            <Row>
              <h4>Dashboard</h4>
            </Row>
            <Row>
              <p>Overview of the GivingBack platform activity</p>
            </Row>
          </>
        );
    }
  };

  return (
    <>
      {role === "NGO" && (
        <Modal
          isOpen={!userBankDetails}
          backdrop="static"
          centered
          toggle={() => setUserBankDetails(true)}
        >
          <ModalHeader
            toggle={() => setUserBankDetails(true)}
            style={{
              backgroundColor: "white",
            }}
          />
          <ModalBody
            className="text-center"
            style={{
              backgroundColor: "white",
              color: "black",
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "column",
            }}
          >
            <div className="p-3">
              <svg
                width="112"
                height="112"
                viewBox="0 0 112 112"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="56" cy="56" r="56" fill="#E6E6E6" />
                <g clip-path="url(#clip0_45_8596)">
                  <path
                    d="M75.1384 64.3897C73.7944 68.0319 71.762 71.1989 69.0966 73.8017C66.0628 76.7642 62.0902 79.1182 57.289 80.7975C57.1314 80.8524 56.967 80.8974 56.8019 80.9306C56.5837 80.9737 56.3616 80.997 56.1415 81H56.0984C55.8638 81 55.6281 80.9764 55.3942 80.9306C55.2291 80.8974 55.0669 80.8524 54.9101 80.7986C50.1032 79.122 46.1257 76.7691 43.0888 73.8066C40.4223 71.2039 38.3902 68.0388 37.0482 64.3965C34.6079 57.7742 34.7468 50.479 34.8586 44.6165L34.8605 44.5265C34.883 44.0424 34.8975 43.5339 34.9055 42.9724C34.9463 40.2155 37.1382 37.9347 39.8955 37.781C45.6442 37.4602 50.0914 35.5852 53.8912 31.8816L53.9244 31.851C54.5554 31.2723 55.3504 30.9885 56.1415 31.0004C56.9045 31.0103 57.6644 31.2937 58.2728 31.851L58.3052 31.8816C62.1058 35.5852 66.553 37.4602 72.3017 37.781C75.059 37.9347 77.2509 40.2155 77.2918 42.9724C77.2998 43.5377 77.3143 44.0455 77.3368 44.5265L77.3379 44.5647C77.4493 50.4382 77.5874 57.7479 75.1384 64.3897Z"
                    fill="#00DD80"
                  />
                  <path
                    d="M75.1384 64.3893C73.7945 68.0316 71.762 71.1986 69.0967 73.8013C66.0629 76.7638 62.0902 79.1179 57.2891 80.7971C57.1315 80.852 56.9671 80.8971 56.8019 80.9302C56.5837 80.9733 56.3617 80.9966 56.1416 80.9997V31C56.9045 31.0099 57.6644 31.2934 58.2729 31.8507L58.3053 31.8812C62.1059 35.5849 66.5531 37.4598 72.3018 37.7806C75.0591 37.9344 77.251 40.2152 77.2918 42.9721C77.2998 43.5374 77.3143 44.0451 77.3368 44.5262L77.338 44.5643C77.4494 50.4378 77.5875 57.7475 75.1384 64.3893Z"
                    fill="#00AA63"
                  />
                  <path
                    d="M68.5583 56.0002C68.5583 62.8563 62.9915 68.4372 56.1411 68.4616H56.0972C49.2266 68.4616 43.6357 62.8712 43.6357 56.0002C43.6357 49.1295 49.2266 43.5391 56.0972 43.5391H56.1411C62.9915 43.5635 68.5583 49.1444 68.5583 56.0002Z"
                    fill="white"
                  />
                  <path
                    d="M68.5588 56.0002C68.5588 62.8563 62.992 68.4372 56.1416 68.4616V43.5391C62.992 43.5635 68.5588 49.1444 68.5588 56.0002Z"
                    fill="#E1EBF0"
                  />
                  <path
                    d="M61.7539 54.2056L56.1418 59.8186L54.9291 61.0313C54.6426 61.3177 54.2668 61.4608 53.8915 61.4608C53.5157 61.4608 53.1403 61.3177 52.8535 61.0313L50.2461 58.4228C49.6732 57.8498 49.6732 56.9217 50.2461 56.3483C50.8183 55.7754 51.7476 55.7754 52.3206 56.3483L53.8915 57.9192L59.6795 52.1312C60.2525 51.5578 61.1817 51.5578 61.7539 52.1312C62.3269 52.7042 62.3269 53.6334 61.7539 54.2056Z"
                    fill="#B4D2D7"
                  />
                  <path
                    d="M61.7538 54.2056L56.1416 59.8186V55.6686L59.6794 52.1312C60.2523 51.5578 61.1816 51.5578 61.7538 52.1312C62.3268 52.7042 62.3268 53.6334 61.7538 54.2056Z"
                    fill="#6FA5AA"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_45_8596">
                    <rect
                      width="50"
                      height="50"
                      fill="white"
                      transform="translate(31 31)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h4 className="p-3">Complete KYC</h4>
            <p>
              Hey there, we noticed you haven’t completed your KYC. Please do so
              to verify your account and get projects.
            </p>

            <div className="text-center">
              <Button
                className="p-3 mt-5 mb-3"
                style={{
                  border: "none",
                  width: "-webkit-fill-available",
                  background: "#02a95c",
                  color: "white",
                }}
                type="button"
                onClick={() => navigate("/ngo/profile")}
              >
                Get started
              </Button>
            </div>
          </ModalBody>
        </Modal>
      )}

      <Container>
        <Col className="p-4">{renderBreadcrumbs(role)} </Col>
      </Container>
      <DashBox items={dashBoxItems} />
      {role === "NGO" && (
        <Container fluid className="mt-4">
          <div
            style={{
              backgroundColor: "#128330",
              color: "white",
              padding: "2rem",
              borderRadius: "0.5rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                opacity: 0.2,
              }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "4rem",
                    height: "5rem",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "0.5rem",
                    transform: "rotate(12deg)",
                  }}
                ></div>
                <div
                  style={{
                    width: "4rem",
                    height: "5rem",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "0.5rem",
                    transform: "rotate(-6deg)",
                    position: "absolute",
                    top: "-0.5rem",
                    left: "-0.5rem",
                  }}
                ></div>
                <div
                  style={{
                    width: "4rem",
                    height: "5rem",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    borderRadius: "0.5rem",
                    position: "absolute",
                    top: "-1rem",
                    left: "-1rem",
                  }}
                ></div>
              </div>
            </div>

            <div style={{ maxWidth: "72rem" }}>
              <h4
                style={{
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  color: "white",
                }}
              >
                Complete Your Profile Setup
              </h4>

              <p
                style={{
                  color: "white",
                  marginBottom: "1.25rem",
                }}
              >
                You're almost there! Set up your account to unlock full access
                and increase visibility. Here's what to do next
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    {hasBankDetails ? (
                      <CircleCheckBig
                        style={{
                          width: "1rem",
                          height: "1rem",
                          marginTop: "0.5rem",
                        }}
                      />
                    ) : (
                      <Circle
                        style={{
                          width: "1rem",
                          height: "1rem",
                          marginTop: "0.5rem",
                        }}
                      />
                    )}
                    <div>
                      <p
                        style={{
                          textDecoration: "underline",
                        }}
                      >
                        Provide Bank Details – Securely receive donations
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    {hasAddress ? (
                      <CircleCheckBig
                        style={{
                          width: "1rem",
                          height: "1rem",
                          marginTop: "0.5rem",
                        }}
                      />
                    ) : (
                      <Circle
                        style={{
                          width: "1rem",
                          height: "1rem",
                          marginTop: "0.5rem",
                        }}
                      />
                    )}
                    <div>
                      <p
                        style={{
                          textDecoration: "underline",
                        }}
                      >
                        Add Your Organization's Bio – Tell donors about your
                        mission
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    {hasActiveProject ? (
                      <CircleCheckBig
                        style={{
                          width: "1rem",
                          height: "1rem",
                          marginTop: "0.5rem",
                        }}
                      />
                    ) : (
                      <Circle
                        style={{
                          width: "1rem",
                          height: "1rem",
                          marginTop: "0.5rem",
                        }}
                      />
                    )}
                    <div>
                      <p
                        style={{
                          textDecoration: "underline",
                        }}
                      >
                        Create Your First Project – Show donors what you are
                        capable of{" "}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    {isFirstTimeLogin ? (
                      <CircleCheckBig
                        style={{
                          width: "1rem",
                          height: "1rem",
                          marginTop: "0.5rem",
                        }}
                      />
                    ) : (
                      <Circle
                        style={{
                          width: "1rem",
                          height: "1rem",
                          marginTop: "0.5rem",
                        }}
                      />
                    )}
                    <div>
                      <p
                        style={{
                          textDecoration: "underline",
                        }}
                      >
                        Explore the Dashboard – Familiarize yourself with
                        GivingBack
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}
      {role === "NGO" && (
        <Tables
          tableName="Recent Transactions"
          headers={headers}
          data={tableData}
          isPagination={false}
          actions={actions}
          emptyStateContent="No Transactions found found"
          emptyStateButtonLabel="Create New Project"
          onEmptyStateButtonClick={handleEmptyStateClick}
          currentPage={""}
          totalPages={""}
          onPageChange={""}
        />
      )}
      {(role === "donor" || role === "corporate") && (
        <div
          style={{
            padding: "20px",
            minHeight: "100vh",
          }}
        >
          <Container>
            {lastUpdated && (
              <div
                className=" items-center gap-2 px-4 py-2"
                style={{
                  width: "21vw",
                  backgroundColor: "#e2efe9",
                  borderRadius: "3.5rem",
                  display: window.innerWidth < 768 ? "none" : "inline-flex",
                }}
              >
                <Clock className="w-4 h-4 mr-2" style={{ color: "#128330" }} />
                <span
                  className="text-sm font-medium"
                  style={{ color: "#128330" }}
                >
                  Last updated: {lastUpdated}
                </span>
              </div>
            )}

            <Row className="mb-5 mt-5">
              <Col>
                <Card className="border-0 shadow-sm">
                  <CardBody className="text-center py-5">
                    <div className="mb-4">
                      <Map
                        size={48}
                        className="text-primary mx-auto"
                        style={{
                          color: "#007bff",
                          backgroundColor: "#e9ecef",
                          borderRadius: "50%",
                          padding: "8px",
                        }}
                      />
                    </div>
                    <p className="mb-3" style={{ fontWeight: 600 }}>
                      No impact highlights yet
                    </p>
                    <p
                      className="text-muted mb-4"
                      style={{ maxWidth: "400px", margin: "0 auto" }}
                    >
                      Once your projects begin making an impact, you'll see
                      highlights showcased here.
                    </p>
                    <Button
                      color="success"
                      size="lg"
                      className="px-4"
                      style={{
                        backgroundColor: "#28a745",
                        borderColor: "#28a745",
                        fontWeight: 500,
                      }}
                      onClick={() => navigate("/donor/projects/brief_initiate")}
                    >
                      Create your first project
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* Bottom section */}
            <Row>
              {/* Recent activities */}
              <Col md={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <h5
                    className=" fw-normal pl-2 pt-2"
                    style={{ fontSize: "1.5rem", color: "#333" }}
                  >
                    Recent activities
                  </h5>

                  {/* Divider */}
                  <hr style={{ borderColor: "#e5e5e5" }} />

                  <CardBody className="text-center py-5">
                    <div className="mb-3">
                      <Info
                        size={24}
                        className="text-muted mx-auto"
                        style={{
                          backgroundColor: "#e9ecef",
                          borderRadius: "50%",
                          padding: "8px",
                          width: "40px",
                          height: "40px",
                        }}
                      />
                    </div>
                    <p
                      className="text-muted mb-0"
                      style={{ fontSize: "0.875rem" }}
                    >
                      You have no activities so far. Once you start to make
                      activities it would appear here
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* Quick actions */}

              <Col md={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <h5
                    className=" fw-normal pl-2 pt-2"
                    style={{ fontSize: "1.5rem", color: "#333" }}
                  >
                    Quick Actions
                  </h5>

                  {/* Divider */}
                  <hr style={{ borderColor: "#e5e5e5" }} />

                  <div className="">
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <Button
                        color="success"
                        size="lg"
                        className="d-flex align-items-center justify-content-center py-3 w-75"
                        style={{
                          margin: "15px",
                          backgroundColor: "#4ade80",
                          borderColor: "#4ade80",
                        }}
                        onClick={() =>
                          navigate("/donor/projects/brief_initiate")
                        }
                      >
                        <Plus className="mr-2" size={20} />
                        Create a new project brief
                      </Button>

                      <Button
                        color="primary"
                        size="lg"
                        className="d-flex align-items-center justify-content-center py-3 w-75"
                        style={{
                          margin: "15px",
                          backgroundColor: "#3b82f6",
                          borderColor: "#3b82f6",
                        }}
                        onClick={() => navigate("/donor/fund_management")}
                      >
                        <Heart className="mr-2" size={20} />
                        Donate to projects
                      </Button>

                      <Button
                        size="lg"
                        className="d-flex align-items-center justify-content-center py-3 text-white w-75"
                        style={{
                          margin: "15px",
                          backgroundColor: "#a855f7",
                          borderColor: "#a855f7",
                        }}
                        onClick={() => navigate("/donor/ngo_directory")}
                      >
                        <Book className="mr-2" size={20} />
                        View NGO directory
                      </Button>

                      <Button
                        color="dark"
                        size="lg"
                        className="d-flex align-items-center justify-content-center py-3 rounded-3 w-75"
                        style={{
                          margin: "15px",
                          backgroundColor: "#374151",
                          borderColor: "#374151",
                        }}
                        onClick={() => navigate("/donor/messages")}
                      >
                        <Send className="mr-2" size={20} />
                        Send message
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default Dashboard;

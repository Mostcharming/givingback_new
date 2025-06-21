/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Book,
  Circle,
  CircleCheckBig,
  FolderOpenDot,
  House,
  Mic,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import DashBox from "../../components/dashbox";
import { formatDate } from "../../components/formatTime";
import Tables from "../../components/tables";
import useBackendService from "../../services/backend_service";
import { capitalizeFirstLetter } from "../../services/capitalize";
import { useContent } from "../../services/useContext";

const Dashboard = () => {
  const { authState, currentState } = useContent();
  console.log(authState, currentState);
  const navigate = useNavigate();
  const [dashBoxItems, setDashBoxItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [actions, setActions] = useState([]);

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
      console.log("Dashboard items:", items);
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
    if (authState.user?.role === "admin") {
      getDashAdmin({});
      getTableData({});
    } else if (
      authState.user?.role === "donor" ||
      authState.user?.role === "corporate"
    ) {
      getDash({});
      getTableData({ projectType: "present", donor_id: currentState?.user.id });
    } else if (authState.user?.role === "NGO") {
      getDash({});
      getTableData({
        projectType: "present",
        ngo_id: currentState?.user.id,
      });
    }
  }, [authState.user?.role]);

  const getDashBoxItems = (role, data: any) => {
    // Return dash box items based on role
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
            title: "Completed Projects",
            amount: data.completedProjectsCount || 0,
            iconClass: <House />,
            bgColor: "bg-success",
          },
          {
            title: "Ongoing Projects",
            amount: data.activeProjectsCount || 0,
            iconClass: <House />,
            bgColor: "bg-info",
          },
          {
            title: "Total Project Funding",
            amount: data.totalDonations,
            iconClass: <House />,
            bgColor: "bg-warning",
          },
          {
            title: "Wallet Balance",
            amount: data.walletBalance,
            iconClass: <House />,
            bgColor: "bg-primary",
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
    const role = authState.user?.role;
    switch (role) {
      case "admin":
        navigate("/admin/briefs"); // Redirect to admin briefs
        break;
      case "donor":
      case "corporate":
        navigate("/donor/briefs"); // Redirect to donor briefs
        break;
      case "NGO":
        navigate("/ngo/briefs"); // Redirect to NGO briefs
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
      <Container>
        <Col className="p-4">{renderBreadcrumbs(role)} </Col>
      </Container>
      <DashBox items={dashBoxItems} />
      {authState.user?.role === "NGO" && (
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
    </>
  );
};

export default Dashboard;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { FolderOpenDot, House, Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import DashBox from "../../components/dashbox";
import { formatDate } from "../../components/formatTime";
import Tables from "../../components/tables";
import useBackendService from "../../services/backend_service";
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
  const { mutate: getTableData } = useBackendService("/allprojects", "GET", {
    onSuccess: (res: any) => {
      const filteredData =
        res.projects?.map((project: any) => ({
          title: project.title, // Adjust field name if necessary
          description: project.description, // Adjust field name if necessary
          amount: project.cost, // Adjust field name if necessary
          dateTime: formatDate(project.createdAt), // Adjust field name if necessary
        })) || [];

      // Update the table data with filtered data
      setTableData(filteredData);
      setupTableAttributes(role);
    },
    onError: () => {
      setupTableAttributes(role);

      toast.error("Error getting projects data");
    },
  });

  useEffect(() => {
    if (authState.user?.role === "admin") {
      getDashAdmin({});
      getTableData({ projectType: "present" });
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
        organization_id: currentState?.user.id,
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
            iconClass: <House />,
            bgColor: "#FFF9E6",
          },
          {
            title: "Wallet Balance",
            amount: data.walletBalance,
            iconClass: <House />,
            bgColor: "bg-primary",
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
        setHeaders(["Project Title", "Description", "Amount", "Date-Time"]);
        setActions([
          // {
          //   label: 'View',
          //   onClick: (row) => console.log('View details of', row)
          // }
        ]);
        break;
      case "donor":
      case "corporate":
        setHeaders(["Project Title", "Description", "Amount", "Date-Time"]);
        setActions([
          // {
          //   label: 'View',
          //   onClick: (row) => console.log('View details of', row)
          // }
        ]);
        break;
      case "admin":
        setHeaders(["Project Title", "Description", "Amount", "Date-Time"]);
        setActions([
          // {
          //   label: 'View',
          //   onClick: (row) => console.log('View details of', row)
          // }
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
      <Tables
        tableName="Recent Projects"
        headers={headers}
        data={tableData}
        isPagination={false}
        actions={actions}
        emptyStateContent="No projects found"
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

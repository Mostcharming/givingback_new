import { BanknoteArrowUp, HandCoins, Landmark, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import DashBox from "../../components/dashbox";
import { formatDate } from "../../components/formatTime";
import Tables from "../../components/tables";
import useBackendService from "../../services/backend_service";
import { capitalizeFirstLetter } from "../../services/capitalize";
import { useContent } from "../../services/useContext";

const FundsM = () => {
  const { authState, currentState } = useContent();

  const navigate = useNavigate();
  const [dashBoxItems, setDashBoxItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [actions, setActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = async () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

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
        setTotalPages(res.totalPages || 1);
        setupTableAttributes(role);
      },
      onError: () => {
        setupTableAttributes(role);

        toast.error("Error getting projects data");
      },
    }
  );
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
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
        page: currentPage,
        limit: 10,
        projectType: "present",
        ngo_id: currentState?.user.id,
      });
    }
  }, [currentPage]);

  const getDashBoxItems = (role, data: any) => {
    // Return dash box items based on role
    switch (role) {
      case "NGO":
        return [
          {
            title: "Wallet Balance",
            amount: data.walletBalance,
            iconClass: <Wallet />,
            bgColor: "#128330",
            color: "white",
          },

          {
            title: "Donations Received",
            amount: data.totalDonations,
            iconClass: <HandCoins />,
            bgColor: "#2196F3",
            color: "white",
          },

          {
            title: "Current Funding",
            amount: "₦0.00",
            iconClass: <BanknoteArrowUp />,
            bgColor: "#9C27B0",
            color: "white",
          },
          {
            title: "Withdrawal Account",
            amount: "---",
            iconClass: <Landmark />,
            bgColor: "#DD7723",
            color: "white",
          },
        ];
      case "donor":
      case "corporate":
        return [
          {
            title: "Wallet Balance",
            amount: data.walletBalance,
            iconClass: "fas fa-wallet",
            bgColor: "bg-primary",
          },
          {
            title: "Ongoing Projects",
            amount: data.activeProjectsCount,
            iconClass: "fas fa-spinner",
            bgColor: "bg-info",
          },
          {
            title: "Donations Made",
            amount: data.totalDonations,
            iconClass: "fas fa-donate",
            bgColor: "bg-warning",
          },
          {
            title: "Current Funding",
            amount: "₦0.00",
            iconClass: "fas fa-check-circle",
            bgColor: "bg-success",
          },
        ];
      case "admin":
        return [
          {
            title: "Number of NGOs",
            amount: data.ngoUsersCount,
            iconClass: "fas fa-users",
            bgColor: "bg-success",
          },
          {
            title: "Pending Requests",
            amount: data.pendingRequests,
            iconClass: "fas fa-clock",
            bgColor: "bg-warning",
          },
          {
            title: "Total Project Funding",
            amount: data.donationCount,
            iconClass: "fas fa-donate",
            bgColor: "bg-info",
          },
          {
            title: "Number of Projects",
            amount: data.projectCount,
            iconClass: "fas fa-tasks",
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
          {
            label: "View",
            onClick: (row) => console.log("View details of", row),
          },
        ]);
        break;
      case "donor":
      case "corporate":
        setHeaders(["Transaction-No", "Amount", "Type", "Status", "Date-Time"]);
        setActions([
          {
            label: "View",
            onClick: (row) => console.log("View details of", row),
          },
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

  const handleEmptyStateClick = () => {};
  const fund = () => {
    if (authState.user.role === "NGO") {
      navigate("/ngo/fund_wallet");
    } else {
      navigate("/donor/fund_wallet");
    }
  };
  const send = () => {
    if (authState.user.role === "NGO") {
      navigate("/ngo/send_money");
    } else {
      navigate("/donor/send_money");
    }
  };

  return (
    <div className="min-vh-100 p-4">
      <div className="container-fluid">
        <div className="row align-items-center mb-5">
          <div className="col">
            <h3 className="text-custom-green fs-2 fw-semibold mb-0">
              Fund Management
            </h3>
          </div>
          <div className="col-auto">
            <Button
              // onClick={handleAddProject}

              className="btn px-5 py-3"
              style={{
                border: "none",
                background: "#02a95c",
              }}
            >
              Fund Wallet
            </Button>
            <button
              // onClick={handleAddProject}
              type="button"
              className="btn btn-outline-success px-5 py-3"
            >
              Withdraw
            </button>
          </div>
        </div>
        <DashBox items={dashBoxItems} />

        <Tables
          tableName="All Transactions"
          headers={headers}
          data={tableData}
          isPagination={false}
          actions={actions}
          emptyStateContent="No Transactions found found"
          emptyStateButtonLabel="Add funds"
          onEmptyStateButtonClick={handleEmptyStateClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FundsM;

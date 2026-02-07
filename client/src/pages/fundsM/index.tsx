/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BanknoteArrowUp,
  CheckCircle,
  Copy,
  HandCoins,
  Landmark,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, Spinner } from "reactstrap";
import DashBox from "../../components/dashbox";
import { formatDate } from "../../components/formatTime";
import Tables from "../../components/tables";
import useBackendService from "../../services/backend_service";
import { capitalizeFirstLetter } from "../../services/capitalize";
import { useContent } from "../../services/useContext";
import FundWalletModal from "./modal/fund";
import WithdrawFundsModal from "./modal/withdraw";

const FundsM = () => {
  const { authState, currentState } = useContent();
  const [dashBoxItems, setDashBoxItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [actions, setActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fundmodalOpen, setFundModalOpen] = useState(false);
  const [withdrawmodalOpen, setWithdrawModalOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const ftoggleModal = () => setFundModalOpen(!fundmodalOpen);
  const wtoggleModal = () => setWithdrawModalOpen(!withdrawmodalOpen);

  const role = authState.user?.role;

  const accountNumber = currentState?.bank?.[0]?.accountNumber;

  const handleCopy = () => {
    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber);
      toast.success("Account number copied!");
    }
  };

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
            amount: accountNumber ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>{accountNumber}</span>
                <Copy
                  size={16}
                  color="#128330"
                  style={{ cursor: "pointer" }}
                  onClick={handleCopy}
                />
              </div>
            ) : (
              <span
                style={{
                  textDecoration: "underline",
                  color: "#128330",
                  cursor: "pointer",
                }}
              >
                Add account
              </span>
            ),
            iconClass: <Landmark />,
            bgColor: "#DD7723",
            color: "white",
          },
          // {
          //   title: "Withdrawal Account",
          //   amount: "---",
          //   iconClass: <Landmark />,
          //   bgColor: "#DD7723",
          //   color: "white",
          // },
        ];
      case "donor":
      case "corporate":
        return [
          {
            title: "Wallet Balance",
            amount: data.walletBalance,
            iconClass: <Wallet />,
            bgColor: "bg-primary",
          },
          {
            title: "Ongoing Projects",
            amount: data.activeProjectsCount,
            iconClass: <Spinner />,
            bgColor: "bg-info",
          },
          {
            title: "Donations Made",
            amount: data.totalDonations,
            iconClass: <HandCoins />,
            bgColor: "bg-warning",
          },
          {
            title: "Current Funding",
            amount: "₦0.00",
            iconClass: <CheckCircle />,
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

  return (
    <div className="min-vh-100 p-4">
      <div className="container-fluid">
        <FundWalletModal isOpen={fundmodalOpen} toggle={ftoggleModal} />
        <WithdrawFundsModal
          isOpen={withdrawmodalOpen}
          toggle={wtoggleModal}
          setShowSuccessModal={setShowSuccessModal}
          setShowErrorModal={setShowErrorModal}
        />

        <div className="row align-items-center mb-5">
          <div className="col">
            <h3 className="text-custom-green fs-2 fw-semibold mb-0">
              Fund Management
            </h3>
          </div>
          <div className="col-auto">
            <Button
              onClick={ftoggleModal}
              className="btn px-5 py-3"
              style={{
                border: "none",
                background: "#02a95c",
              }}
            >
              Fund Wallet
            </Button>
            <button
              onClick={wtoggleModal}
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
          isPagination={true}
          actions={actions}
          emptyStateContent="No Transactions found found"
          emptyStateButtonLabel="Add funds"
          onEmptyStateButtonClick={handleEmptyStateClick}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <Modal
        isOpen={showSuccessModal}
        toggle={() => setShowSuccessModal(false)}
        centered
      >
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
              <g clip-path="url(#clip0_45_18996)">
                <path
                  d="M56 112C86.9279 112 112 86.9279 112 56C112 25.0721 86.9279 0 56 0C25.0721 0 0 25.0721 0 56C0 86.9279 25.0721 112 56 112Z"
                  fill="#4CAF50"
                />
                <path
                  d="M41.6904 81.2616L70.4854 110.057C94.334 103.697 112 81.9682 112 55.9998C112 55.4698 112 54.9398 112 54.4099L89.3876 33.5645L41.6904 81.2616Z"
                  fill="#128330"
                />
                <path
                  d="M57.4128 68.543C59.886 71.0162 59.886 75.256 57.4128 77.7292L52.2898 82.8522C49.8166 85.3254 45.5769 85.3254 43.1037 82.8522L20.6684 60.2402C18.1952 57.767 18.1952 53.5273 20.6684 51.0541L25.7914 45.9311C28.2646 43.4579 32.5043 43.4579 34.9775 45.9311L57.4128 68.543Z"
                  fill="white"
                />
                <path
                  d="M77.022 29.5014C79.4952 27.0282 83.7349 27.0282 86.2081 29.5014L91.3311 34.6244C93.8043 37.0976 93.8043 41.3373 91.3311 43.8105L52.4668 82.4982C49.9936 84.9714 45.7538 84.9714 43.2807 82.4982L38.1576 77.3752C35.6844 74.902 35.6844 70.6623 38.1576 68.1891L77.022 29.5014Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_45_18996">
                  <rect width="112" height="112" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h4 className="p-3">Withdrawal successful</h4>
          <p>
            Your transaction is successful, and the request for withdrawal has
            been sent to the admin for processing.
          </p>
          <div className="text-center">
            <Button
              className="p-3 mt-5 mb-3"
              style={{
                border: "none",
                width: "-webkit-fill-available",
                background: "#128330",
                color: "white",
              }}
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
              }}
            >
              Continue
            </Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={showErrorModal} backdrop="static" centered>
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
              <g clip-path="url(#clip0_45_19258)">
                <path
                  d="M56 112C86.9279 112 112 86.9279 112 56C112 25.0721 86.9279 0 56 0C25.0721 0 0 25.0721 0 56C0 86.9279 25.0721 112 56 112Z"
                  fill="#CE0303"
                />
                <path
                  d="M32.5049 81.2621L62.7131 111.47C88.1516 108.467 108.29 88.505 111.47 63.0665L81.0853 32.6816L32.5049 81.2621Z"
                  fill="#AD0E0E"
                />
                <path
                  d="M82.4982 68.3666C84.9714 70.8398 84.9714 75.0795 82.4982 77.5527L77.5518 82.4991C75.0787 84.9723 70.8389 84.9723 68.3657 82.4991L29.5014 43.6347C27.0282 41.1616 27.0282 36.9218 29.5014 34.4486L34.6244 29.3256C37.0976 26.8524 41.3373 26.8524 43.8105 29.3256L82.4982 68.3666Z"
                  fill="white"
                />
                <path
                  d="M62.0064 47.6973L47.6973 62.0064L68.366 82.4985C70.8392 84.9717 75.079 84.9717 77.5522 82.4985L82.6752 77.3755C85.1484 74.9023 85.1484 70.6626 82.6752 68.1894L62.0064 47.6973Z"
                  fill="#D6D6D6"
                />
                <path
                  d="M68.3657 29.5014C70.8389 27.0282 75.0787 27.0282 77.5518 29.5014L82.6749 34.6244C85.1481 37.0976 85.1481 41.3373 82.6749 43.8105L43.6339 82.4982C41.1607 84.9714 36.9209 84.9714 34.4477 82.4982L29.5014 77.5518C27.0282 75.0787 27.0282 70.8389 29.5014 68.3657L68.3657 29.5014Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_45_19258">
                  <rect width="112" height="112" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h4 className="p-3">Withdrawal failed</h4>
          <p>
            Oops, your transaction was unsuccessful. Don’t fret, kindly try
            again
          </p>
          <div className="text-center">
            <Button
              className="p-3 mt-5 mb-3"
              style={{
                border: "none",
                width: "-webkit-fill-available",
                background: "#CE0303",
                color: "white",
              }}
              type="button"
              onClick={() => {
                setShowErrorModal(false);
              }}
            >
              Try again
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default FundsM;

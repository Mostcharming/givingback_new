import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatDate } from "../../../../../components/formatTime";
import Tables from "../../../../../components/tables";
import useBackendService from "../../../../../services/backend_service";
import { capitalizeFirstLetter } from "../../../../../services/capitalize";

const Transactions = ({ project }) => {
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [actions, setActions] = useState([]);
  const hasUpdates = tableData.length > 0;

  const handleEmptyStateClick = () => {
    console.log("clicked");
  };

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

        setTableData(filteredData);
        setupTableAttributes();
      },
      onError: () => {
        setupTableAttributes();

        toast.error("Error getting projects data");
      },
    }
  );
  useEffect(() => {
    getTableData({
      project_id: project.id,
    });
  }, []);

  const setupTableAttributes = () => {
    setHeaders(["Transaction-No", "Amount", "Type", "Status", "Date-Time"]);
    setActions([
      // {
      //   label: 'View',
      //   onClick: (row) => console.log('View details of', row)
      // }
    ]);
  };

  return (
    <div style={{ width: "80vw" }} className="row">
      <div className="col-12 mt-5">
        {!hasUpdates ? (
          <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="mb-4">
              <CircleAlert
                size={48}
                className="text-muted"
                style={{ opacity: 0.4 }}
              />
            </div>
            <div className="text-center mb-5">
              <h4
                className="fw-medium text-dark mb-3"
                style={{ fontSize: "20px" }}
              >
                No transactions yet
              </h4>
              <p
                className="text-muted mb-0"
                style={{ fontSize: "14px", maxWidth: "300px" }}
              >
                No transaction has been made so far. When you start transacting,
                it would reflect here.
              </p>
            </div>
          </div>
        ) : (
          <Tables
            tableName="All Transactions"
            headers={headers}
            data={tableData}
            isPagination={false}
            actions={actions}
            emptyStateContent="No Transactions found found"
            emptyStateButtonLabel=" "
            onEmptyStateButtonClick={handleEmptyStateClick}
            currentPage={""}
            totalPages={""}
            onPageChange={""}
          />
        )}
      </div>
    </div>
  );
};

export default Transactions;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Row } from "reactstrap";
import * as XLSX from "xlsx";
import BulkUploadNgoModal from "../components/BulkUploadNgoModal";
import Donor_Ngo_Dialog from "../components/donor_ngo_dialog";
import Loading from "../components/home/loading";
import Tables from "../components/tables";
import UpdateNGO from "../components/updatengo";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";
import NGOManagement from "./NGOManagement";

const Ngo = () => {
  const { authState } = useContent();
  const navigate = useNavigate();
  const [Tableheaders, setTableHeaders] = useState([]);
  const [TableData, setTableData] = useState([]);
  const [TableActions, setTableActions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //filters
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);

  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [selectedNgoId, setSelectedNgoId] = useState<number>();
  const [filteredNgos, setFilteredNgos] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");

  const { mutate: fetchUsers, isLoading } = useBackendService(
    "/donor/users",
    "GET",
    {
      onSuccess: (res: any) => {
        const filteredData =
          res.users
            ?.filter((project: any) => project.id) // Remove users without an id
            .map((project: any) => ({
              id: project.id,
              Organization: project.name, // Adjust field name if necessary
              Area: project.interest_area, // Adjust field name if necessary
              Address: project.address?.[0]?.address ?? "", // Avoid error and provide default empty value
              State: project.address?.[0]?.state ?? "", // Avoid error and provide default empty value
              Status: project.active ? "Active" : "Inactive",
              PhoneNumber: project.phone,
            })) || [];

        setTableData(filteredData);
        setFilteredNgos(filteredData);
        setTotalPages(res.totalPages || 1);
      },
      onError: (error) => {
        toast.error("Failed to fetch NGOs.");
      },
    }
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    setupTableAttributes(authState.user?.role);
    fetchUsers({ page: currentPage, interest_area: selectedArea });
  }, [currentPage, selectedArea]);

  const setupTableAttributes = (role: string) => {
    switch (role) {
      case "donor":
      case "corporate":
        setTableHeaders([
          "Organization",
          "Areas",
          "Address",
          "State",
          "Status",
          "PhoneNUmber",
        ]);
        setTableActions([
          {
            label: "View",
            onClick: (row) => openNgoPage(row.id),
          },
          { label: "Message", onClick: (row) => openModal(row.id) },
        ]);
        break;
      case "admin":
        setTableHeaders([
          "Organization",
          "Areas",
          "Address",
          "State",
          "Status",
          "PhoneNUmber",
        ]);
        setTableActions([
          {
            label: "View",
            onClick: (row) => openNgoPage(row.id),
          },
          { label: "Update", onClick: (row) => openModal(row.id) },
        ]);
        break;
      default:
        setTableHeaders([]);
        setTableActions([]);
    }
  };

  const handleEmptyStateClick = () => {
    const role = authState.user?.role;
    switch (role) {
      case "admin":
        navigate("/admin/dashboard"); // Redirect to admin briefs
        break;
      case "donor":
      case "corporate":
        navigate("/donor/dashboard"); // Redirect to donor briefs
        break;
      default:
        console.log("Invalid role or no role found");
    }
  };

  ///filters

  const { mutate: getAreas } = useBackendService("/areas", "GET", {
    onSuccess: (res2: any) => {
      setAreas(res2 as any[]);
    },
    onError: () => {},
  });

  useEffect(() => {
    getAreas({});
  }, []);

  const downloadExcel = () => {
    const data = filteredNgos.map((ngo) => ({
      "Name of Organization": ngo.Organization,
      Phone: ngo.PhoneNumber,
      "Interest Area": ngo.Area,
      State: ngo.State,
      Address: ngo.Address,
      Active: ngo.Status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NGOs");
    XLSX.writeFile(workbook, "ngo_directory.xlsx");
  };

  let timeoutId: NodeJS.Timeout;
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = event.target.value.toLowerCase();
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      try {
        fetchUsers({ page: 1, name: searchQuery });

        setIsSearchActive(true);
      } catch (error) {
        toast.error("Error fetching search results");
      }
    }, 1000);
  };
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
    fetchUsers({ page: currentPage });
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e);
  };

  const handleFilter = (filter) => {
    const filtered = TableData.filter((ngo) => {
      if (filter === "active") return ngo.Status === "Active";
      if (filter === "inactive") return ngo.Status === "Inactive";
      if (filter) return ngo.Area.toLowerCase() === filter.toLowerCase();
      return true;
    });
    setFilteredNgos(filtered);
  };

  const filter = () => {
    return (
      <Row className="p-3">
        <Col
          lg="12"
          md
          className="d-flex justify-content-between align-items-center"
        >
          {isSearchActive && <h4 className="mr-5">Search Results</h4>}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                style={{
                  border: "1px solid #7b80dd",
                  borderRadius: "3px",
                  padding: "5px 30px 5px 10px",
                  outline: "none",
                }}
                onChange={handleSearch}
              />
              <FaSearch
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#7b80dd",
                }}
              />
            </div>

            <select
              style={{
                border: "1px solid #7b80dd",
                borderRadius: "3px",
                padding: "5px 30px 5px 10px",
                outline: "none",
                appearance: "none",
                width: "300px",
              }}
              value={selectedArea}
              onChange={(e) => handleAreaChange(e.target.value)}
            >
              <option value="">Select Area</option>
              {areas.map((area) => (
                <option key={area.id} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>

            <div style={{ position: "relative" }}>
              <select
                style={{
                  border: "1px solid #7b80dd",
                  borderRadius: "3px",
                  padding: "5px 30px 5px 10px",
                  outline: "none",
                  appearance: "none",
                }}
                onChange={(e) => handleFilter(e.target.value)}
              >
                <option value="">Filter</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <FaFilter
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#7b80dd",
                }}
              />
            </div>

            {isSearchActive ? (
              <div style={{ display: "flex" }}>
                <div
                  style={{ marginRight: "5px", cursor: "pointer" }}
                  onClick={downloadExcel}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="22"
                      cy="22"
                      r="21.5"
                      fill="#E3E5FB"
                      stroke="#7B80DD"
                    />
                    <path
                      d="M15.1126 20.0452V11.4232C15.1126 11.1899 15.3036 11 15.5384 11H26.2799C26.3975 11 26.5036 11.0475 26.581 11.1239L31.042 15.5578C31.1249 15.6403 31.1667 15.7487 31.1667 15.8571V32.5767C31.1667 32.8101 30.9756 33 30.7408 33H15.5384C15.3036 33 15.1126 32.8101 15.1126 32.5767V28.793H11.4258C11.191 28.793 11 28.6031 11 28.3697V20.4679C11 20.2345 11.191 20.0447 11.4258 20.0447H15.1126V20.0452ZM26.7062 12.4456L26.7147 15.6687H29.949L26.7062 12.4456ZM30.315 16.5152H26.2919C26.0581 16.5132 25.8681 16.3244 25.8681 16.092L25.857 11.8465H15.9637V20.0452H24.5891C24.8239 20.0452 25.0149 20.235 25.0149 20.4684V28.3702C25.0149 28.6036 24.8239 28.7935 24.5891 28.7935H15.9637V32.154H30.3145V16.5157L30.315 16.5152ZM24.1632 20.8917H11.8517V27.947H24.1632V20.8917Z"
                      fill="#7B80DD"
                    />
                    <path
                      d="M13.037 26.2865L14.3337 24.3392L13.1572 22.5512H14.0441L14.7836 23.6636L15.5232 22.5512H16.4116L15.2321 24.3397L16.5267 26.2865H15.6157L14.7831 25.0212L13.9491 26.2865H13.037Z"
                      fill="#7B80DD"
                    />
                    <path
                      d="M16.9386 26.2865V22.5826H17.6997V25.6553H19.5836V26.2865H16.9386Z"
                      fill="#7B80DD"
                    />
                    <path
                      d="M19.924 25.0761L20.664 25.0027C20.7083 25.2495 20.7977 25.4289 20.9335 25.5453C21.0692 25.6608 21.2517 25.7177 21.4815 25.7177C21.7248 25.7177 21.9088 25.6668 22.032 25.5643C22.1557 25.4614 22.218 25.3415 22.218 25.204C22.218 25.1156 22.1914 25.0401 22.1401 24.9777C22.0878 24.9167 21.9968 24.8622 21.8676 24.8173C21.7796 24.7863 21.578 24.7318 21.2633 24.6534C20.8581 24.5529 20.5735 24.4295 20.4101 24.2826C20.1804 24.0767 20.0657 23.8254 20.0657 23.5285C20.0657 23.3381 20.1195 23.1593 20.2276 22.9929C20.3357 22.827 20.4916 22.7005 20.6952 22.6136C20.8993 22.5266 21.1446 22.4832 21.4332 22.4832C21.9028 22.4832 22.2568 22.5871 22.4941 22.795C22.7319 23.0023 22.8565 23.2792 22.8681 23.626L22.1069 23.652C22.0748 23.4591 22.0059 23.3212 21.8998 23.2367C21.7937 23.1518 21.6348 23.1098 21.4232 23.1098C21.2045 23.1098 21.033 23.1548 20.9099 23.2452C20.8299 23.3037 20.7897 23.3811 20.7897 23.4781C20.7897 23.567 20.8274 23.6425 20.9023 23.7049C20.9983 23.7859 21.2301 23.8693 21.5986 23.9563C21.9662 24.0427 22.2381 24.1332 22.4141 24.2246C22.5911 24.3181 22.7293 24.4445 22.8289 24.6049C22.9289 24.7658 22.9787 24.9642 22.9787 25.2C22.9787 25.4134 22.9194 25.6143 22.7987 25.8012C22.6791 25.9881 22.5106 26.1275 22.2914 26.2179C22.0727 26.3089 21.8002 26.3544 21.474 26.3544C20.9988 26.3544 20.6343 26.2454 20.3794 26.0276C20.1251 25.8102 19.9742 25.4929 19.924 25.0761Z"
                      fill="#7B80DD"
                    />
                  </svg>
                </div>
                <div style={{ cursor: "pointer" }} onClick={handleClearSearch}>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="22"
                      cy="22"
                      r="21.5"
                      fill="#E3E5FB"
                      stroke="#7B80DD"
                    />
                    <path
                      d="M29.7782 13.7782C30.1408 14.1408 30.106 14.7733 29.7171 15.244L29.621 15.3495L23.4142 21.5563L29.621 27.7632C30.0983 28.2405 30.1687 28.944 29.7782 29.3345C29.4155 29.6972 28.783 29.6624 28.3124 29.2734L28.2068 29.1774L22 22.9706L15.7932 29.1774C15.3159 29.6547 14.6123 29.725 14.2218 29.3345C13.8592 28.9719 13.894 28.3394 14.2829 27.8687L14.379 27.7632L20.5858 21.5563L14.379 15.3495C13.9017 14.8722 13.8313 14.1687 14.2218 13.7782C14.5845 13.4155 15.217 13.4503 15.6876 13.8393L15.7932 13.9353L22 20.1421L28.2068 13.9353C28.6841 13.458 29.3877 13.3877 29.7782 13.7782Z"
                      fill="#7B80DD"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              authState.user.role === "admin" && (
                <Button
                  style={{
                    backgroundColor: "#7B80DD",
                    color: "#fff",
                    borderRadius: "3px",
                    border: "none",
                  }}
                  onClick={() => setIsBulkUploadModalOpen(true)}
                >
                  + Upload Record
                </Button>
              )
            )}
          </div>
        </Col>
      </Row>
    );
  };

  ///actions

  const openModal = (id: number) => {
    setSelectedNgoId(id);
    if (authState.user.role === "admin") {
      setIsModalOpenUpdate(true);
    } else {
      setIsModalOpen(true);
    }
  };
  const openNgoPage = (id: number) => {
    const role = authState.user?.role;
    switch (role) {
      case "admin":
        navigate(`/admin/ngo/${id}`);
        break;
      case "donor":
      case "corporate":
        navigate(`/donor/ngo/${id}`);
        break;
      default:
        console.log("Invalid role or no role found");
    }
  };

  const closeModal = async () => {
    if (authState.user.role === "admin") {
      setIsModalOpenUpdate(false);
      fetchUsers({ page: currentPage, interest_area: selectedArea });
    } else {
      setIsModalOpen(false);
    }
  };

  // Show NGO Management page for donor/corporate roles
  const role = authState.user?.role;
  if (role === "donor" || role === "corporate") {
    return <NGOManagement />;
  }

  return (
    <>
      {isLoading ? (
        <Loading type="inline" />
      ) : (
        <Tables
          tableName="NGO Directory"
          headers={Tableheaders}
          data={filteredNgos}
          isPagination={true}
          actions={TableActions}
          emptyStateContent="No NGOs available"
          emptyStateButtonLabel="Back to Dashboard"
          onEmptyStateButtonClick={handleEmptyStateClick}
          filter={filter}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      <Donor_Ngo_Dialog
        open={isModalOpen}
        handleClose={closeModal}
        id={selectedNgoId}
      />
      <UpdateNGO
        open={isModalOpenUpdate}
        handleClose={closeModal}
        id={selectedNgoId}
      />
      <BulkUploadNgoModal
        open={isBulkUploadModalOpen}
        handleClose={() => setIsBulkUploadModalOpen(false)}
      />
    </>
  );
};
export default Ngo;

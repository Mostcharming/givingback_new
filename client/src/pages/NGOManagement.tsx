/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, FileText, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Container, Row } from "reactstrap";
import EmptyNGO from "../assets/images/emptyngo.svg";
import AddNGOModal from "../components/AddNGOModal";
import NGOCard from "../components/NGOCard";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";
import "./ngo-management.css";

const NGOManagement = () => {
  const { authState, currentState } = useContent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Paper-based NGOs");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counts, setCounts] = useState({
    totalOrganizations: 0,
    donorOrganizationCount: 0,
    verifiedOrganizationsCount: 0,
  });
  const [paperBasedNgos, setPaperBasedNgos] = useState([]);
  const [yourNgos, setYourNgos] = useState([]);
  const [verifiedNgos, setVerifiedNgos] = useState([]);

  const tabs = ["Paper-based NGOs", "Your NGOs", "Verified NGOs"];

  const { mutate: fetchOrganizationCounts, isLoading } = useBackendService(
    "/auth/organization-counts",
    "GET",
    {
      onSuccess: (res: any) => {
        setCounts({
          totalOrganizations: res.totalOrganizations || 0,
          donorOrganizationCount: res.donorOrganizationCount || 0,
          verifiedOrganizationsCount: res.verifiedOrganizationsCount || 0,
        });
      },
      onError: (error) => {
        toast.error("Failed to fetch organization counts.");
        setCounts({
          totalOrganizations: 0,
          donorOrganizationCount: 0,
          verifiedOrganizationsCount: 0,
        });
      },
    }
  );

  const { mutate: fetchOrganizations } = useBackendService(
    "/auth/organizations",
    "GET",
    {
      onSuccess: (res: any) => {
        const organizations = res.data || [];
        if (activeTab === "Paper-based NGOs") {
          setPaperBasedNgos(organizations);
        } else if (activeTab === "Your NGOs") {
          setYourNgos(organizations);
        } else if (activeTab === "Verified NGOs") {
          setVerifiedNgos(organizations);
        }
      },
      onError: (error) => {
        toast.error("Failed to fetch organizations.");
      },
    }
  );

  useEffect(() => {
    const role = authState.user?.role;
    if (role !== "donor" && role !== "corporate") {
      navigate("/");
    }
  }, [authState.user?.role, navigate]);

  useEffect(() => {
    fetchOrganizationCounts({});
  }, [fetchOrganizationCounts]);

  useEffect(() => {
    const userId = currentState.user.id;
    if (activeTab === "Paper-based NGOs") {
      fetchOrganizations({});
    } else if (activeTab === "Your NGOs" && userId) {
      fetchOrganizations({ donor_id: userId });
    } else if (activeTab === "Verified NGOs") {
      fetchOrganizations({ is_verified: 1 });
    }
  }, [activeTab, currentState.user.id, fetchOrganizations]);

  const handleAddNewNGO = () => {
    setIsModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalSuccess = () => {
    // Refresh the data
    fetchOrganizationCounts({});
  };

  return (
    <Container
      fluid
      className="ngo-management-container"
      style={{
        minHeight: "100vh",
        padding: "0",
      }}
    >
      <AddNGOModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        onSuccess={handleModalSuccess}
      />
      <Row
        className="align-items-center"
        style={{
          padding: "24px 0",
        }}
      >
        <Col
          lg="6"
          md="12"
          className="left-content"
          style={{ paddingLeft: "60px", paddingRight: "30px" }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "4px",
              color: "#1a1a1a",
              lineHeight: "1.2",
            }}
          >
            NGO Management
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
              marginBottom: "0",
            }}
          >
            Manage and track NGO onboarding process
          </p>
        </Col>

        <Col
          lg="6"
          md="12"
          className="right-content"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "60px",
          }}
        >
          <Button
            onClick={handleAddNewNGO}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              boxShadow: "0 2px 8px rgba(40, 167, 69, 0.2)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#218838";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#28a745";
            }}
          >
            + Add new NGO
          </Button>
        </Col>
      </Row>

      <div style={{ padding: "10px 0px" }}></div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <div className="tab-wrapper">
          {tabs.map((tab) => {
            const getIcon = () => {
              if (tab === "Paper-based NGOs")
                return <FileText size={18} style={{ marginRight: "8px" }} />;
              if (tab === "Your NGOs")
                return <Monitor size={18} style={{ marginRight: "8px" }} />;
              if (tab === "Verified NGOs")
                return <CheckCircle size={18} style={{ marginRight: "8px" }} />;
              return null;
            };

            const getCount = () => {
              if (tab === "Paper-based NGOs") return counts.totalOrganizations;
              if (tab === "Your NGOs") return counts.donorOrganizationCount;
              if (tab === "Verified NGOs")
                return counts.verifiedOrganizationsCount;
              return 0;
            };

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${
                  activeTab === tab ? "tab-active" : ""
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {getIcon()}
                {tab}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000000",
                    color: "#ffffff",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginLeft: "8px",
                  }}
                >
                  {getCount()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="ngo-tab-content">
        {activeTab === "Paper-based NGOs" && (
          <div className="tab-pane">
            {paperBasedNgos.length > 0 ? (
              <div>
                <div>
                  {paperBasedNgos.map((ngo) => (
                    <NGOCard key={ngo.id} ngo={ngo} />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <img
                  src={EmptyNGO}
                  alt="No data"
                  style={{ maxWidth: "200px", marginBottom: "20px" }}
                />
                <p style={{ fontSize: "16px", color: "#666666" }}>
                  No data available at the moment
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === "Your NGOs" && (
          <div className="tab-pane">
            {yourNgos.length > 0 ? (
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                    }}
                  >
                    Your NGOs: {yourNgos.length}
                  </p>
                </div>
                <div>
                  {yourNgos.map((ngo) => (
                    <NGOCard key={ngo.id} ngo={ngo} />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <img
                  src={EmptyNGO}
                  alt="No data"
                  style={{ maxWidth: "200px", marginBottom: "20px" }}
                />
                <p style={{ fontSize: "16px", color: "#666666" }}>
                  No data available at the moment
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === "Verified NGOs" && (
          <div className="tab-pane">
            {verifiedNgos.length > 0 ? (
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                    }}
                  >
                    Verified NGOs: {verifiedNgos.length}
                  </p>
                </div>
                <div>
                  {verifiedNgos.map((ngo) => (
                    <NGOCard key={ngo.id} ngo={ngo} />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <img
                  src={EmptyNGO}
                  alt="No data"
                  style={{ maxWidth: "200px", marginBottom: "20px" }}
                />
                <p style={{ fontSize: "16px", color: "#666666" }}>
                  No data available at the moment
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default NGOManagement;

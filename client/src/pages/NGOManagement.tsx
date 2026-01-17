/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, FileText, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { useContent } from "../services/useContext";
import "./ngo-management.css";

const NGOManagement = () => {
  const { authState } = useContent();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Paper-based NGOs");

  const tabs = ["Paper-based NGOs", "Your NGOs", "Verified NGOs"];

  useEffect(() => {
    const role = authState.user?.role;
    if (role !== "donor" && role !== "corporate") {
      navigate("/");
    }
  }, [authState.user?.role, navigate]);

  const handleAddNewNGO = () => {
    // Do nothing
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

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${
                  activeTab === tab ? "tab-active" : ""
                }`}
              >
                {getIcon()}
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="ngo-tab-content">
        {activeTab === "Paper-based NGOs" && (
          <div className="tab-pane">
            <p>Paper-based NGOs content goes here</p>
          </div>
        )}
        {activeTab === "Your NGOs" && (
          <div className="tab-pane">
            <p>Your NGOs content goes here</p>
          </div>
        )}
        {activeTab === "Verified NGOs" && (
          <div className="tab-pane">
            <p>Verified NGOs content goes here</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default NGOManagement;

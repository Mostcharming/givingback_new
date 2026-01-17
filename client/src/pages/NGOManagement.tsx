/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import { useContent } from "../services/useContext";

const NGOManagement = () => {
  const { authState } = useContent();
  const navigate = useNavigate();

  useEffect(() => {
    const role = authState.user?.role;
    if (role !== "donor" && role !== "corporate") {
      navigate("/");
    }
  }, [authState.user?.role, navigate]);

  const handleAddNewNGO = () => {
    navigate("/donor/add-ngo");
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

      <div style={{ padding: "40px 60px" }}></div>
    </Container>
  );
};

export default NGOManagement;

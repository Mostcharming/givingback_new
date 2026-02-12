/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { useContent } from "../services/useContext";
import "./funds-disbursement.css";

const FundsDisbursement = () => {
  const { authState } = useContent();
  const navigate = useNavigate();
  const [disbursements, setDisbursements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if user is not authorized
  useEffect(() => {
    const role = authState.user?.role;
    if (role !== "donor" && role !== "corporate" && role !== "ngo") {
      navigate("/");
    }
  }, [authState.user?.role, navigate]);

  return (
    <Container
      fluid
      className="funds-disbursement-container"
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
          lg="12"
          md="12"
          className="left-content"
          style={{ paddingLeft: "60px", paddingRight: "60px" }}
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
            Funds & Disbursement
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
              marginBottom: "0",
            }}
          >
            Monitor fund allocation and disbursement tracking
          </p>
        </Col>
      </Row>

      <div style={{ padding: "10px 0px" }}></div>

      {/* Main Content Area */}
      <div
        className="funds-content"
        style={{ paddingLeft: "60px", paddingRight: "60px" }}
      >
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <p style={{ fontSize: "16px", color: "#666666" }}>
            No disbursement data available at the moment
          </p>
        </div>
      </div>
    </Container>
  );
};

export default FundsDisbursement;

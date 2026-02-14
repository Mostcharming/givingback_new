/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BanknoteArrowDown,
  CircleDollarSign,
  Clock,
  Upload,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";
import "./funds-disbursement.css";

const FundsDisbursement = () => {
  const { authState } = useContent();
  const navigate = useNavigate();
  const [disbursements, setDisbursements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dashBoxItems, setDashBoxItems] = useState([
    {
      title: "Total Allocated",
      amount: "₦0.00",
      iconClass: <Wallet />,
      color: "#128330",
    },
    {
      title: "Total Disbursed",
      amount: "₦0.00",
      iconClass: <BanknoteArrowDown />,
      color: "#3B82F6",
    },
    {
      title: "Pending Disbursement",
      amount: "₦0.00",
      iconClass: <Clock />,
      color: "#FFC107",
    },
    {
      title: "Available Funds",
      amount: "₦0.00",
      iconClass: <CircleDollarSign />,
      color: "#9C27B0",
    },
  ]);

  const { mutate: fetchDashboard } = useBackendService(
    "/donor/dashboard",
    "GET",
    {
      onSuccess: (res: any) => {
        setDashBoxItems([
          {
            title: "Total Allocated",
            amount: res.totalAllocated || "₦0.00",
            iconClass: <Wallet />,
            color: "#128330",
          },
          {
            title: "Total Disbursed",
            amount: res.totalFundDisbursed?.value || "₦0.00",
            iconClass: <BanknoteArrowDown />,
            color: "#3B82F6",
          },
          {
            title: "Pending Disbursement",
            amount: "₦0.00",
            iconClass: <Clock />,
            color: "#FFC107",
          },
          {
            title: "Available Funds",
            amount: res.walletBalance || "₦0.00",
            iconClass: <CircleDollarSign />,
            color: "#9C27B0",
          },
        ]);
      },
      onError: () => {},
    }
  );

  useEffect(() => {
    fetchDashboard({});
  }, []);

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

        <Col
          lg="6"
          md="12"
          className="right-content"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            paddingRight: "60px",
          }}
        >
          <Button
            style={{
              backgroundColor: "#ffffff",
              color: "#1a1a1a",
              border: "1px solid #d0d0d0",
              borderRadius: "6px",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#ffffff";
            }}
          >
            <Upload size={16} style={{ marginRight: "8px" }} />
            Export
          </Button>
          <Button
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
            Allocate Funds
          </Button>
        </Col>
      </Row>

      <div style={{ padding: "10px 0px" }}></div>

      {/* Stats Cards */}
      <Container fluid>
        <Row>
          {dashBoxItems.map((item, index) => (
            <Col lg="6" xl="3" key={index}>
              <Card
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 4px 9px rgba(0, 0, 0, 0.1)",
                }}
                className="card-stats mb-4 mb-xl-0"
              >
                <CardBody style={{ padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <h6
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        color: "#6B7280",
                        fontWeight: "500",
                      }}
                    >
                      {item.title}
                    </h6>
                    <div
                      style={{
                        color: item.color || "#3B82F6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.iconClass}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: "700",
                      color: "#1F2937",
                    }}
                  >
                    {item.amount}
                  </span>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

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

import {
  CheckCircle,
  Clock,
  FileText,
  FileUser,
  FolderDot,
  FolderOpen,
  FolderOpenDot,
  Scroll,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import useBackendService from "../services/backend_service";
import { useContent } from "../services/useContext";

const DN_Projects = () => {
  const { authState } = useContent();
  const navigate = useNavigate();
  const [cardItems, setCardItems] = useState([]);

  const { mutate: getProjectStats } = useBackendService(
    "/donor/project-stats",
    "GET",
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (res: any) => {
        const items = [
          {
            title: "Completed Projects",
            amount: res.completedProjects || 0,
            iconClass: <CheckCircle size={24} />,
            color: "#128330",
          },
          {
            title: "Active Briefs",
            amount: res.activeBriefs || 0,
            iconClass: <FileText size={24} />,
            color: "#2196F3",
          },
          {
            title: "Ongoing Projects",
            amount: res.ongoingProjects || 0,
            iconClass: <Clock size={24} />,
            color: "#FFC107",
          },
          {
            title: "Total Applications",
            amount: res.totalApplications || 0,
            iconClass: <FolderOpen size={24} />,
            color: "#9C27B0",
          },
        ];
        setCardItems(items);
      },
      onError: () => {
        // Default to zero values on error
        const defaultItems = [
          {
            title: "Completed Projects",
            amount: 0,
            iconClass: <FolderDot size={24} />,
            color: "#128330",
          },
          {
            title: "Active Briefs",
            amount: 0,
            iconClass: <Scroll size={24} />,
            color: "#9C27B0",
          },
          {
            title: "Ongoing Projects",
            amount: 0,
            iconClass: <FolderOpenDot size={24} />,
            color: "#2196F3",
          },
          {
            title: "Total Applications",
            amount: 0,
            iconClass: <FileUser size={24} />,
            color: "#FFC107",
          },
        ];
        setCardItems(defaultItems);
        toast.error("Error getting project statistics");
      },
    }
  );

  useEffect(() => {
    const role = authState.user?.role;
    if (role !== "donor" && role !== "corporate") {
      navigate("/");
    } else {
      getProjectStats({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.user?.role, navigate]);

  return (
    <Container
      fluid
      className="project-briefs-container"
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
            Project Briefs
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#666666",
              lineHeight: "1.4",
              marginBottom: "0",
            }}
          >
            Create and manage funding opportunities for NGOs
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
            + Create Brief
          </Button>
        </Col>
      </Row>

      <div style={{ padding: "10px 0px" }}></div>

      {/* Display cards for donor/corporate users */}
      {(authState.user?.role === "donor" ||
        authState.user?.role === "corporate") && (
        <div className="pb-2">
          <Container fluid>
            <Row>
              {cardItems.map((item, index) => (
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
        </div>
      )}

      <div style={{ padding: "10px 0px" }}></div>
    </Container>
  );
};
export default DN_Projects;

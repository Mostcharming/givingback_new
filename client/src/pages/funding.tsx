/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
} from "reactstrap";
import placeholder from "../assets/images/home/GivingBackNG-logo.svg";
import useBackendService from "../services/backend_service";

const FundingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<any[]>([]);

  // Fetch single project details like MilestoneUpdatesPage
  const { mutate: fetchProject } = useBackendService("/allprojects", "GET", {
    onSuccess: (res: any) => {
      // Find the project by id
      const found = res.projects?.find((p: any) => String(p.id) === String(id));
      setProject(found || null);
      setLoading(false);
    },
    onError: () => {
      toast.error("Failed to fetch project details.");
      setLoading(false);
    },
  });

  // Fetch organizations for NGO count and list
  const { mutate: fetchOrganizations } = useBackendService(
    `/auth/projects/${id}/organizations`,
    "GET",
    {
      onSuccess: (res: any) => {
        setOrganizations(res.data || []);
      },
      onError: () => {
        toast.error("Error fetching organizations");
      },
    }
  );

  useEffect(() => {
    setLoading(true);
    fetchProject({ projectType: "present", id });
  }, [id, fetchProject]);

  useEffect(() => {
    if (id) {
      fetchOrganizations({});
    }
  }, [id, fetchOrganizations]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <Spinner color="success" />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <p>Project not found.</p>
        <Button color="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  // Calculate card values
  const budget = Number(project.cost || 0);
  const totalDisbursed = Number(project.total_disbursed || 0);
  const ngoCount = organizations.length;
  const locations =
    Array.isArray(project.locations) && project.locations.length
      ? project.locations.length
      : project.state
      ? 1
      : 0;

  return (
    <Container fluid style={{ minHeight: "100vh", padding: 0 }}>
      {/* Header Section - full width */}
      <Row className="align-items-center" style={{ padding: "24px 0" }}>
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
          <Button
            style={{
              marginTop: "50px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 400,
              textDecoration: "none",
              boxShadow: "none",
              background: "none",
              border: "none",
              padding: 0,
              color: "black",
            }}
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={18} style={{ color: "#1a1a1a" }} /> Go Back
          </Button>
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
          {/* Empty for now, matches FundsDisbursement layout */}
        </Col>
      </Row>
      {/* Main Content Area - full width */}
      <div style={{ padding: "0 30px" }}>
        <h2 style={{ fontWeight: 700, marginBottom: 32 }}>{project.title}</h2>
        <Row style={{ marginBottom: 32 }}>
          <Col md={3} sm={6} xs={12} style={{ marginBottom: 32 }}>
            <Card
              style={{
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <CardBody
                style={{ textAlign: "left", color: "#1a1a1a", padding: "24px" }}
              >
                <div style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>
                  Budget
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#1a1a1a",
                    textAlign: "left",
                  }}
                >
                  ₦{budget.toLocaleString()}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={12} style={{ marginBottom: 32 }}>
            <Card
              style={{
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <CardBody
                style={{ textAlign: "left", color: "#1a1a1a", padding: "24px" }}
              >
                <div style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>
                  Total Disbursed
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#1a1a1a",
                    textAlign: "left",
                  }}
                >
                  ₦{totalDisbursed.toLocaleString()}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={12} style={{ marginBottom: 32 }}>
            <Card
              style={{
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <CardBody
                style={{ textAlign: "left", color: "#1a1a1a", padding: "24px" }}
              >
                <div style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>
                  NGO
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#1a1a1a",
                    textAlign: "left",
                  }}
                >
                  {ngoCount}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={12} style={{ marginBottom: 32 }}>
            <Card
              style={{
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <CardBody
                style={{ textAlign: "left", color: "#1a1a1a", padding: "24px" }}
              >
                <div style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>
                  Locations
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#1a1a1a",
                    textAlign: "left",
                  }}
                >
                  {locations}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* NGO Cards List */}
        {organizations.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3
              style={{ fontWeight: 600, marginBottom: 16, textAlign: "left" }}
            >
              NGOs Assigned
            </h3>
            <Row style={{ justifyContent: "flex-start", marginLeft: 0 }}>
              {organizations.map((org: any) => (
                <Col xs={12} key={org.id} style={{ marginBottom: 24 }}>
                  <Card
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      padding: "24px",
                      minHeight: "80px",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: "24px",
                      textAlign: "left",
                    }}
                  >
                    <img
                      src={org.image || placeholder}
                      alt={org.name}
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #e0e0e0",
                        alignSelf: "flex-start",
                        margin: 0,
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: 4,
                        height: "100%",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 18 }}>
                        {org.name}
                      </div>
                      <div style={{ fontSize: 14, color: "#555" }}>
                        <b>Email:</b> {org.email || org.contact || "N/A"}
                      </div>
                      {org.phone ? (
                        <div style={{ fontSize: 14, color: "#555" }}>
                          <b>Phone:</b> {org.phone}
                        </div>
                      ) : null}
                      {org.address ? (
                        <div style={{ fontSize: 14, color: "#555" }}>
                          <b>Address:</b> {org.address}
                        </div>
                      ) : null}
                      {org.description ? (
                        <div
                          style={{ fontSize: 13, color: "#888", marginTop: 4 }}
                        >
                          {org.description}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
        <Card></Card>
      </div>
    </Container>
  );
};

export default FundingDetail;

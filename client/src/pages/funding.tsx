/* eslint-disable @typescript-eslint/no-explicit-any */
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
import useBackendService from "../services/backend_service";

const FundingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    setLoading(true);
    fetchProject({ projectType: "present", id });
  }, [id, fetchProject]);

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
  const ngoCount = Array.isArray(project.organization)
    ? project.organization.length
    : project.organization
    ? 1
    : 0;
  const locations =
    Array.isArray(project.locations) && project.locations.length
      ? project.locations.length
      : project.state
      ? 1
      : 0;

  return (
    <Container style={{ maxWidth: 900, marginTop: 40 }}>
      <h2 style={{ fontWeight: 700, marginBottom: 32 }}>{project.title}</h2>
      <Row style={{ marginBottom: 32 }}>
        <Col md={3} sm={6} xs={12} style={{ marginBottom: 16 }}>
          <Card>
            <CardBody style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#888" }}>Budget</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>
                ₦{budget.toLocaleString()}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12} style={{ marginBottom: 16 }}>
          <Card>
            <CardBody style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#888" }}>Total Disbursed</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>
                ₦{totalDisbursed.toLocaleString()}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12} style={{ marginBottom: 16 }}>
          <Card>
            <CardBody style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#888" }}>NGO</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>{ngoCount}</div>
            </CardBody>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12} style={{ marginBottom: 16 }}>
          <Card>
            <CardBody style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#888" }}>Locations</div>
              <div style={{ fontWeight: 700, fontSize: 22 }}>{locations}</div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Card>
        <CardBody>
          <p style={{ color: "#666", marginBottom: 8 }}>
            {project.description}
          </p>
          <Row style={{ marginBottom: 16 }}>
            <Col md={6}>
              <strong>Status:</strong> {project.status}
            </Col>
            <Col md={6}>
              <strong>Budget:</strong> ₦{budget.toLocaleString()}
            </Col>
          </Row>
          <Row style={{ marginBottom: 16 }}>
            <Col md={6}>
              <strong>Start Date:</strong> {project.startDate}
            </Col>
            <Col md={6}>
              <strong>End Date:</strong> {project.endDate}
            </Col>
          </Row>
          <Row style={{ marginBottom: 16 }}>
            <Col md={12}>
              <strong>Organizations:</strong>{" "}
              {Array.isArray(project.organization)
                ? project.organization.map((o: any) => o.name).join(", ")
                : project.organization?.name || "—"}
            </Col>
          </Row>
          <Button color="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FundingDetail;

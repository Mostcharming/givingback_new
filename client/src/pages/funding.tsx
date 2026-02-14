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

  const { mutate: fetchProject } = useBackendService(
    `/auth/donor/projects/${id}`,
    "GET",
    {
      onSuccess: (res: any) => {
        setProject(res.data || res);
        setLoading(false);
      },
      onError: () => {
        toast.error("Failed to fetch project details.");
        setLoading(false);
      },
    }
  );

  useEffect(() => {
    if (id) fetchProject({});
  }, [id]);

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

  return (
    <Container style={{ maxWidth: 700, marginTop: 40 }}>
      <Card>
        <CardBody>
          <h2 style={{ fontWeight: 700 }}>{project.title}</h2>
          <p style={{ color: "#666", marginBottom: 8 }}>
            {project.description}
          </p>
          <Row style={{ marginBottom: 16 }}>
            <Col md={6}>
              <strong>Budget:</strong> ₦
              {Number(project.cost || 0).toLocaleString()}
            </Col>
            <Col md={6}>
              <strong>Status:</strong> {project.status}
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

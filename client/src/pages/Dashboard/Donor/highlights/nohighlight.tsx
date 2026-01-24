import { Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Col, Row } from "reactstrap";

export default function NoHighlights() {
  const navigate = useNavigate();
  return (
    <Row className="mb-5 mt-5">
      <Col>
        <Card className="border-0 shadow-sm">
          <CardBody className="text-center py-5">
            <div className="mb-4">
              <Map
                size={48}
                className="text-primary mx-auto"
                style={{
                  color: "#007bff",
                  backgroundColor: "#e9ecef",
                  borderRadius: "50%",
                  padding: "8px",
                }}
              />
            </div>
            <p className="mb-3" style={{ fontWeight: 600 }}>
              No impact highlights yet
            </p>
            <p
              className="text-muted mb-4"
              style={{ maxWidth: "400px", margin: "0 auto" }}
            >
              Once your projects begin making an impact, you'll see highlights
              showcased here.
            </p>
            <Button
              color="success"
              size="lg"
              className="px-4"
              style={{
                backgroundColor: "#28a745",
                borderColor: "#28a745",
                fontWeight: 500,
              }}
              onClick={() => navigate("/donor/projects")}
            >
              Create your first project
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

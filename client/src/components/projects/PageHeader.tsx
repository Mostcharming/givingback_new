import { Button, Col, Row } from "reactstrap";
import { STYLES } from "./ProjectsStyles";

export const PageHeader = () => (
  <Row className="align-items-center" style={STYLES.headerRow}>
    <Col lg="6" md="12" className="left-content" style={STYLES.headerCol}>
      <h1 style={STYLES.headerTitle}>Project Briefs</h1>
      <p style={STYLES.headerSubtitle}>
        Create and manage funding opportunities for NGOs
      </p>
    </Col>
    <Col lg="6" md="12" className="right-content" style={STYLES.buttonCol}>
      <Button
        style={STYLES.primaryButton as React.CSSProperties}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.backgroundColor =
            STYLES.primaryButtonHover;
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.backgroundColor =
            STYLES.primaryButton.backgroundColor;
        }}
      >
        + Create Brief
      </Button>
    </Col>
  </Row>
);

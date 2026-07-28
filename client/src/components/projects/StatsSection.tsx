import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { STYLES } from "./ProjectsStyles";
import type { StatCardItem } from "./ProjectsTypes";

export const StatCard = ({ item }: { item: StatCardItem }) => (
  <Col lg="6" xl="3">
    <Card style={STYLES.statCard}>
      <CardBody style={STYLES.statCardBody}>
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
          <div style={{ color: item.color, display: "flex" }}>
            {item.iconClass}
          </div>
        </div>
        <span style={{ fontSize: "1.875rem", fontWeight: "700" }}>
          {item.amount}
        </span>
      </CardBody>
    </Card>
  </Col>
);

export const StatsSection = ({ items }: { items: StatCardItem[] }) => (
  <div className="pb-2">
    <Container fluid>
      <Row>
        {items.map((item, index) => (
          <StatCard key={index} item={item} />
        ))}
      </Row>
    </Container>
  </div>
);

import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

interface DonorDashBoxItem {
  title: string;
  amount: number | string;
  iconClass: React.ReactNode;
  trendPercentage: number;
  trendDirection: "up" | "down";
  color?: string;
}

interface DonorDashBoxProps {
  items: DonorDashBoxItem[];
}

const DonorDashBox: React.FC<DonorDashBoxProps> = ({ items }) => {
  return (
    <>
      <div className="pb-2">
        <Container fluid>
          <div className="header-body">
            <Row>
              {items.map((item, index) => (
                <Col lg="6" xl="3" key={index}>
                  <Card
                    style={{
                      borderRadius: "15px",
                      boxShadow: "0 4px 9px rgba(0, 0, 0, 0.1)",
                    }}
                    className="card-stats mb-4 mb-xl-0"
                  >
                    <CardBody style={{ padding: "20px" }}>
                      {/* First line: Title and Icon */}
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

                      {/* Second line: Amount and Trend */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1.875rem",
                            fontWeight: "700",
                            color: "#1F2937",
                          }}
                        >
                          {item.amount}
                        </span>

                        {/* Trend indicator */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                            backgroundColor:
                              item.trendDirection === "up"
                                ? "#DCFCE7"
                                : "#FEE2E2",
                            borderRadius: "6px",
                          }}
                        >
                          {item.trendDirection === "up" ? (
                            <TrendingUp
                              size={16}
                              style={{ color: "#16A34A" }}
                            />
                          ) : (
                            <TrendingDown
                              size={16}
                              style={{ color: "#DC2626" }}
                            />
                          )}
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              color:
                                item.trendDirection === "up"
                                  ? "#16A34A"
                                  : "#DC2626",
                            }}
                          >
                            {item.trendDirection === "up" ? "+" : ""}
                            {item.trendPercentage}% from last month
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default DonorDashBox;

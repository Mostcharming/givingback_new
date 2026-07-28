import React from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";

interface DashBoxItem {
  title: string;
  amount: string;
  iconClass: string;
  bgColor: string;
  color?: string;
}

interface DashBoxProps {
  items: DashBoxItem[];
}

const DashBox: React.FC<DashBoxProps> = ({ items }) => {
  return (
    <>
      <div className="header bg-gradient-info pb-2 ">
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
                    <CardBody>
                      <Row
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          flexDirection: "column",
                        }}
                      >
                        <Col className="col-auto">
                          <div
                            style={{
                              backgroundColor: `${item.bgColor}`,
                              height: "50px",
                              color: `${item.color}`,
                              borderRadius: "20%",
                            }}
                            className={`icon icon-shape`}
                          >
                            {item.iconClass}
                          </div>
                        </Col>
                        <Col className="">
                          <div className="">
                            <CardTitle
                              tag="h6"
                              className="mt-3 text-muted mb-0"
                            >
                              {item.title}
                            </CardTitle>
                            <span className="mt-4 h6 font-weight-bold mb-0">
                              {item.amount}
                            </span>
                          </div>
                        </Col>
                      </Row>
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

export default DashBox;

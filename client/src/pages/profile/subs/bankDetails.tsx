/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreditCard } from "lucide-react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import { useContent } from "../../../services/useContext";

export default function BankDetails() {
  const { currentState } = useContent();
  const bankDetails = currentState?.bank || [];

  return (
    <Container className="py-3" style={{ width: "80vw" }}>
      <CardBody className="p-4">
        {bankDetails.length === 0 ? (
          // Empty state with ATM card icon
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mb-4"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#f0f9f0",
              }}
            >
              <CreditCard size={48} color="#02a95c" />
            </div>
            <h5 className="mb-2" style={{ color: "#1e1e1e" }}>
              No Bank Account Added
            </h5>
            <p
              className="text-muted mb-4 text-center"
              style={{ maxWidth: "400px", fontSize: "14px" }}
            >
              Link your bank account to receive payments and manage your
              transactions securely
            </p>
            <Button
              color="success"
              style={{
                backgroundColor: "#02a95c",
                borderColor: "#02a95c",
                padding: "0.75rem 2rem",
                fontWeight: "500",
              }}
            >
              Link Bank Account
            </Button>
          </div>
        ) : (
          // Display existing bank accounts
          <div>
            <h5 className="fw-bold mb-4" style={{ color: "#1e1e1e" }}>
              Your Bank Accounts
            </h5>
            <Row>
              {bankDetails.map((account: any, index: number) => (
                <Col md={6} className="mb-4" key={index}>
                  <Card className="border" style={{ borderColor: "#dee2e6" }}>
                    <CardBody className="p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded"
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#f0f9f0",
                            marginRight: "1rem",
                          }}
                        >
                          <CreditCard size={28} color="#02a95c" />
                        </div>
                        <div>
                          <div className="fw-bold" style={{ color: "#1e1e1e" }}>
                            {account.bank_name || "Bank Account"}
                          </div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "12px" }}
                          >
                            {account.account_type || "Savings Account"}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div
                          className="text-muted mb-1"
                          style={{ fontSize: "12px" }}
                        >
                          Account Number
                        </div>
                        <div
                          className="fw-bold"
                          style={{ letterSpacing: "2px" }}
                        >
                          •••• {account.account_number?.slice(-4) || "****"}
                        </div>
                      </div>

                      <div className="mb-3 pb-3 border-bottom">
                        <div
                          className="text-muted mb-1"
                          style={{ fontSize: "12px" }}
                        >
                          Account Holder
                        </div>
                        <div className="fw-bold">
                          {account.account_holder_name || "N/A"}
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <Button
                          color="primary"
                          outline
                          size="sm"
                          style={{
                            flex: 1,
                            borderColor: "#02a95c",
                            color: "#02a95c",
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          color="danger"
                          outline
                          size="sm"
                          style={{ flex: 1 }}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="mt-4">
              <Button
                color="success"
                style={{
                  backgroundColor: "#02a95c",
                  borderColor: "#02a95c",
                  padding: "0.75rem 2rem",
                  fontWeight: "500",
                }}
              >
                Add Another Account
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Container>
  );
}

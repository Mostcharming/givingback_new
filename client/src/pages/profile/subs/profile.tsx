"use client";

import { ShieldCheck, Trash2, User } from "lucide-react";
import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

export default function ProfileUpdateForm() {
  const [selectedInterests, setSelectedInterests] = useState([
    "Health",
    "Education",
    "Slum",
  ]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <Container className="py-5" style={{ width: "80vw" }}>
      <CardBody className="p-4">
        <Form>
          <Row className="mb-4">
            <Col md={7}>
              <Label className="fw-bold mb-3">Profile photo</Label>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center border rounded"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f8f9fa",
                    borderColor: "#dee2e6",
                  }}
                >
                  <User size={32} style={{ color: "#28a745" }} />
                </div>
                <Button
                  color="link"
                  className="p-0 me-3"
                  style={{ color: "#6c757d" }}
                >
                  Upload
                </Button>
                <Button
                  color="link"
                  className="p-0"
                  style={{ color: "#dc3545" }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Col>
            <Col md={5}>
              <Alert
                color="success"
                className="d-flex align-items-center mb-4"
                style={{
                  backgroundColor: "#f0f9f0",
                  border: "1px solid #d4edda",
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "4rem",
                    height: "4rem",
                    backgroundColor: "#128330",
                  }}
                >
                  <ShieldCheck size={32} color={"#ffffff"} />
                </div>
                {/* <CheckCircle
                  size={20}
                  className="me-3"
                  style={{ color: "#28a745" }}
                /> */}
                <div className="pl-3">
                  <div className="fw-bold" style={{ color: "#155724" }}>
                    Let's update your account
                  </div>
                  <div style={{ color: "#155724", fontSize: "14px" }}>
                    Improve your platform experience
                  </div>
                  <div style={{ color: "#28a745", fontSize: "14px" }}>
                    2 new suggestions
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>

          {/* Organization Details */}
          <Row className="mb-3">
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Organization name</Label>
                <Input
                  type="text"
                  defaultValue="The helping hand"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Organization email</Label>
                <Input
                  type="email"
                  defaultValue="support@thehelpinghand.com"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Country</Label>
                <Input
                  type="text"
                  defaultValue="Nigeria"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">State</Label>
                <Input
                  type="text"
                  defaultValue="Lagos"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Areas of Interest */}
          <Row className="mb-3">
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Areas of intrest</Label>
                <div className="d-flex gap-2 flex-wrap mt-2">
                  {["Health", "Education", "Slum"].map((interest) => (
                    <Badge
                      key={interest}
                      color="light"
                      className="px-3 py-2"
                      style={{
                        backgroundColor: selectedInterests.includes(interest)
                          ? "#e9ecef"
                          : "#f8f9fa",
                        color: "#495057",
                        border: "1px solid #dee2e6",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Registration number</Label>
                <Input
                  type="text"
                  defaultValue="1234567890"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Phone and Email */}
          <Row className="mb-4">
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Phone number</Label>
                <div className="d-flex">
                  <Input
                    type="text"
                    defaultValue="+234"
                    style={{
                      width: "80px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRight: "none",
                    }}
                  />
                  <Input
                    type="text"
                    defaultValue="812 3456 789"
                    className="flex-grow-1"
                    style={{
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderLeft: "none",
                    }}
                  />
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Personal email</Label>
                <Input
                  type="email"
                  defaultValue="myself@gmail.com"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Update Button */}
          <div className="text-center mb-4">
            <Button
              color="secondary"
              size="lg"
              className="px-5"
              style={{
                backgroundColor: "#e9ecef",
                borderColor: "#e9ecef",
                color: "#495057",
              }}
            >
              Update profile information
            </Button>
          </div>
        </Form>
      </CardBody>

      <CardBody className="p-4">
        <div className="mb-3">
          <h5 className="fw-bold mb-1">KYC</h5>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            Update your KYC details to verify your account
          </p>
        </div>

        <div className="border-bottom py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">Organization Documents</div>
              <div className="text-muted" style={{ fontSize: "14px" }}>
                Provide your organization documents and credentials
              </div>
            </div>
            <Button color="success" size="sm" outline>
              Update
            </Button>
          </div>
        </div>

        <div className="border-bottom py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">Bank verification number (BVN)</div>
              <div className="text-muted" style={{ fontSize: "14px" }}>
                Provide your organization documents and credentials
              </div>
            </div>
            <Button color="success" size="sm" outline>
              Update
            </Button>
          </div>
        </div>

        <div className="py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-bold">National identity number (NIN)</div>
              <div className="text-muted" style={{ fontSize: "14px" }}>
                Provide your organization documents and credentials
              </div>
            </div>
            <Button color="success" size="sm" outline>
              Update
            </Button>
          </div>
        </div>
      </CardBody>
    </Container>
  );
}

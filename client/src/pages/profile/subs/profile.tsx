import { ShieldCheck, User } from "lucide-react";
import { useRef, useState } from "react";
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
  InputGroup,
  Label,
  Row,
} from "reactstrap";
import { useContent } from "../../../services/useContext";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentState, authState } = useContent();
  const role = authState.user?.role;
  const [formData, setFormData] = useState({
    image: null,
    title: "",

    imageUrl: currentState?.userimage?.filename || null,
  });
  const handleFileChange = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file, // store selected file
        imageUrl: null, // clear backend image
      }));
    }
  };

  return (
    <Container className="py-3" style={{ width: "80vw" }}>
      <CardBody className="p-4">
        <Form>
          <Row className="mb-4">
            <Col md={7}>
              <label className="form-label fw-medium">Profile Photo</label>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="border rounded-lg d-flex align-items-center justify-content-center bg-light overflow-hidden"
                  style={{ width: "80px", height: "80px" }}
                >
                  {formData.image ? (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Sponsor Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Sponsor Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <User size={32} className="text-success" />
                  )}
                </div>
                <button
                  type="button"
                  className="ml-4 btn btn-outline-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
            </Col>
            {!(role === "donor" || role === "corporate") && (
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
            )}
          </Row>

          {/* Organization Details */}
          <Row className="mb-3">
            <Col md={6}>
              <FormGroup className="">
                <Label className="fw-bold">Organization name</Label>
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#f2f2f247", height: "100%" }}
                    className="p-3"
                    // placeholder="Project title"
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
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

      {!(role === "donor" || role === "corporate") && (
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
              {/* <Button color="success" size="sm" outline>
                Update
              </Button> */}
              <div style={{ color: "#128330", cursor: "pointer" }}>Update</div>
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
              {/* <Button color="success" size="sm" outline>
                Update
              </Button> */}
              <div style={{ color: "#128330", cursor: "pointer" }}>Update</div>
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
              {/* <Button color="success" size="sm" outline>
                Update
              </Button> */}
              <div style={{ color: "#128330", cursor: "pointer" }}>Update</div>
            </div>
          </div>
        </CardBody>
      )}
    </Container>
  );
}

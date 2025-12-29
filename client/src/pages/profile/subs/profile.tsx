/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShieldCheck, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  Alert,
  Button,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import useBackendService from "../../../services/backend_service";
import { useContent } from "../../../services/useContext";

export default function ProfileUpdateForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentState, authState } = useContent();
  const role = authState.user?.role;

  const [areas, setAreas] = useState([]);
  const { mutate: getAreas } = useBackendService("/areas", "GET", {
    onSuccess: (res2: any) => {
      setAreas(res2 as any[]);
    },
    onError: () => {},
  });

  useEffect(() => {
    getAreas({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState({
    image: null,
    name: currentState?.user?.name || "",
    email: currentState?.user?.email || "",
    orgEmail: "",
    phone: "",
    country: currentState?.address?.[0]?.address || "Nigeria",
    state: currentState?.address?.[0]?.state || "",
    registrationNumber: "",
    personalEmail: currentState?.user?.email || "",
    areasOfInterest: [],
    imageUrl: currentState?.userimage?.filename || null,
  });

  const handleFileChange = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imageUrl: null,
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imageUrl: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAreasChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      areasOfInterest: selectedOptions || [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add API call to submit form data
    const submissionData = {
      ...formData,
      areasOfInterest: formData.areasOfInterest
        .map((area) => area.value)
        .join(","),
    };
    console.log("Form submitted:", submissionData);
  };

  return (
    <Container className="py-3" style={{ width: "80vw" }}>
      <CardBody className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={7}>
              <label className="form-label fw-bold mb-3">Profile Photo</label>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="border rounded-lg d-flex align-items-center justify-content-center bg-light overflow-hidden"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#f2f4f6",
                  }}
                >
                  {formData.image ? (
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <User size={32} color="#64748b" />
                  )}
                </div>
                <Button
                  type="button"
                  color="secondary"
                  outline
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    marginLeft: "20px",
                    padding: "0.5rem 1rem",
                    borderColor: "#dee2e6",
                  }}
                >
                  Upload
                </Button>
                {(formData.image || formData.imageUrl) && (
                  <Button
                    type="button"
                    color="danger"
                    outline
                    onClick={handleRemoveImage}
                    style={{
                      padding: "0.5rem 0.75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
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
                    padding: "1rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "4rem",
                      height: "4rem",
                      backgroundColor: "#128330",
                      flexShrink: 0,
                    }}
                  >
                    <ShieldCheck size={32} color="#ffffff" />
                  </div>

                  <div style={{ marginLeft: "1rem" }}>
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
              <FormGroup>
                <Label className="fw-bold">
                  {role === "donor" || role === "corporate"
                    ? "Full Name"
                    : "Organization Name"}
                </Label>
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{
                      backgroundColor: "#F2F2F2",
                      height: "100%",
                      padding: "0.75rem",
                    }}
                    placeholder={
                      role === "donor" || role === "corporate"
                        ? "Enter your full name"
                        : "Enter organization name"
                    }
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">
                  {role === "donor" || role === "corporate"
                    ? "Email"
                    : "Organization Email"}
                </Label>
                <Input
                  type="email"
                  placeholder={
                    role === "donor" || role === "corporate"
                      ? "your.email@example.com"
                      : "organization@example.com"
                  }
                  value={formData.email}
                  readOnly
                  style={{
                    backgroundColor: "#F2F2F2",
                    border: "1px solid #dee2e6",
                    padding: "0.75rem",
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
                  placeholder="Nigeria"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  style={{
                    backgroundColor: "#F2F2F2",
                    border: "1px solid #dee2e6",
                    padding: "0.75rem",
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">State</Label>
                <Input
                  type="text"
                  placeholder="Lagos"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  style={{
                    backgroundColor: "#F2F2F2",
                    border: "1px solid #dee2e6",
                    padding: "0.75rem",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Areas of Interest */}
          <Row className="mb-3">
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Areas of Interest</Label>
                <InputGroup className="input-group-alternative">
                  <Select
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "#F2F2F2",
                        minHeight: "44px",
                        height: "100%",
                        border: "1px solid #dee2e6",
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        height: "100%",
                        padding: "0 6px",
                      }),
                      input: (provided) => ({
                        ...provided,
                        margin: "0px",
                      }),
                      indicatorsContainer: (provided) => ({
                        ...provided,
                        height: "44px",
                      }),
                    }}
                    className="w-100"
                    placeholder="Select areas of interest"
                    onChange={handleAreasChange}
                    value={formData.areasOfInterest}
                    options={areas.map((category) => ({
                      value: category.name,
                      label: category.name,
                    }))}
                    isMulti
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">
                  {role === "donor" || role === "corporate"
                    ? "Registration Number"
                    : "Registration Number (CAC)"}
                </Label>
                <Input
                  type="text"
                  placeholder={
                    role === "donor" || role === "corporate"
                      ? "Enter your Registration number"
                      : "Enter CAC registration number"
                  }
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      registrationNumber: e.target.value,
                    }))
                  }
                  style={{
                    backgroundColor: "#F2F2F2",
                    border: "1px solid #dee2e6",
                    padding: "0.75rem",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Phone and Email */}
          <Row className="mb-4">
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Phone Number</Label>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText
                      style={{
                        backgroundColor: "#F2F2F2",
                        height: "100%",
                      }}
                    >
                      +234 |
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="812 3456 789"
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label className="fw-bold">Personal Email</Label>
                <Input
                  type="email"
                  placeholder="yourself@example.com"
                  value={formData.personalEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalEmail: e.target.value,
                    }))
                  }
                  style={{
                    backgroundColor: "#F2F2F2",
                    border: "1px solid #dee2e6",
                    padding: "0.75rem",
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Update Button */}
          <div className="text-center mb-4">
            <Button
              type="submit"
              style={{
                backgroundColor: "#02a95c",
                borderColor: "#02a95c",
                color: "white",
                padding: "0.75rem 2rem",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Update Profile Information
            </Button>
          </div>
        </Form>
      </CardBody>

      {!(role === "donor" || role === "corporate") && (
        <CardBody className="p-4">
          <div className="mb-4">
            <h5 className="fw-bold mb-1">KYC Verification</h5>
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              Update your KYC details to verify and secure your account
            </p>
          </div>

          <div className="border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold" style={{ color: "#1e1e1e" }}>
                  Organization Documents
                </div>
                <div className="text-muted" style={{ fontSize: "14px" }}>
                  Provide your organization documents and credentials
                </div>
              </div>
              <div
                style={{
                  color: "#02a95c",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#026e46")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#02a95c")}
              >
                Update
              </div>
            </div>
          </div>

          <div className="border-bottom py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold" style={{ color: "#1e1e1e" }}>
                  Bank Verification Number (BVN)
                </div>
                <div className="text-muted" style={{ fontSize: "14px" }}>
                  Provide your bank details for verification
                </div>
              </div>
              <div
                style={{
                  color: "#02a95c",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#026e46")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#02a95c")}
              >
                Update
              </div>
            </div>
          </div>

          <div className="py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold" style={{ color: "#1e1e1e" }}>
                  National Identity Number (NIN)
                </div>
                <div className="text-muted" style={{ fontSize: "14px" }}>
                  Provide your national ID for identity verification
                </div>
              </div>
              <div
                style={{
                  color: "#02a95c",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#026e46")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#02a95c")}
              >
                Update
              </div>
            </div>
          </div>
        </CardBody>
      )}
    </Container>
  );
}

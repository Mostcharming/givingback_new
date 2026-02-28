import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  Button,
  CardBody,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

export default function Security() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password criteria checks
  const hasUppercase = /[A-Z]/.test(form.newPassword);
  const hasLowercase = /[a-z]/.test(form.newPassword);
  const hasNumber = /[0-9]/.test(form.newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(form.newPassword);
  const allCriteriaMet =
    hasUppercase && hasLowercase && hasNumber && hasSpecial;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    // Add password change logic here
    toast.success("Password changed successfully!");
  };

  return (
    <Container className="py-3" style={{ width: "80vw" }}>
      <CardBody className="p-4">
        <h4 className="fw-bold mb-2">Security</h4>
        <p className="text-muted mb-4">Reset the password to your account</p>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    type={showCurrent ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#F2F2F2",
                        height: "100%",
                      }}
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <FaEyeSlash /> : <FaEye />}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </div>
            <div className="col-md-3"></div>
            <div className="col-md-3"></div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <FormGroup className="mb-3 mt-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#F2F2F2",
                        height: "100%",
                      }}
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup className="mb-4 mt-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    type={showConfirm ? "text" : "password"}
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    value={form.confirmNewPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#F2F2F2",
                        height: "100%",
                      }}
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-6 d-flex flex-column align-items-start">
              <span style={{ fontSize: "15px", fontWeight: 500 }}>
                Password Criteria
              </span>
              <div className="mt-2">
                <div
                  className="d-flex align-items-center mb-1"
                  style={{
                    fontSize: "14px",
                    color: hasUppercase ? "#02a95c" : "#6c757d",
                    fontWeight: hasUppercase ? 600 : 400,
                  }}
                >
                  <FaCheckCircle
                    style={{
                      marginRight: 8,
                      color: hasUppercase ? "#02a95c" : "#ccc",
                    }}
                  />
                  Must contain uppercase
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{
                    fontSize: "14px",
                    color: hasLowercase ? "#02a95c" : "#6c757d",
                    fontWeight: hasLowercase ? 600 : 400,
                  }}
                >
                  <FaCheckCircle
                    style={{
                      marginRight: 8,
                      color: hasLowercase ? "#02a95c" : "#ccc",
                    }}
                  />
                  Must contain lowercase
                </div>
              </div>
            </div>
            <div className="col-md-6 d-flex flex-column align-items-start mt-md-4 mt-2">
              <div
                className="d-flex align-items-center mb-1"
                style={{
                  fontSize: "14px",
                  color: hasNumber ? "#02a95c" : "#6c757d",
                  fontWeight: hasNumber ? 600 : 400,
                }}
              >
                <FaCheckCircle
                  style={{
                    marginRight: 8,
                    color: hasNumber ? "#02a95c" : "#ccc",
                  }}
                />
                Must contain number
              </div>
              <div
                className="d-flex align-items-center"
                style={{
                  fontSize: "14px",
                  color: hasSpecial ? "#02a95c" : "#6c757d",
                  fontWeight: hasSpecial ? 600 : 400,
                }}
              >
                <FaCheckCircle
                  style={{
                    marginRight: 8,
                    color: hasSpecial ? "#02a95c" : "#ccc",
                  }}
                />
                Must contain special character (including punctuation)
              </div>
            </div>
          </div>
          <Button
            type="submit"
            color="success"
            style={{
              backgroundColor: allCriteriaMet ? "#02a95c" : "#EEEEEE",
              borderColor: allCriteriaMet ? "#02a95c" : "#EEEEEE",
              color: allCriteriaMet ? "white" : "#333",
              padding: "0.75rem 2rem",
              fontWeight: "500",
              cursor: allCriteriaMet ? "pointer" : "not-allowed",
              opacity: allCriteriaMet ? 1 : 0.7,
            }}
            disabled={!allCriteriaMet}
          >
            Change Password
          </Button>
        </Form>
      </CardBody>
    </Container>
  );
}

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
  Modal,
  ModalBody,
} from "reactstrap";
import useBackendService from "../../../services/backend_service";

export default function Security() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { mutate: changePassword } = useBackendService(
    "/auth/changepassword", // adjust endpoint if needed
    "POST",
    {
      onSuccess: () => {
        setShowSuccessModal(true);
        toast.success("Password changed successfully!");
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      },
      onError: (error) => {
        const err = error as { response?: { data?: { message?: string } } };
        const errorMessage =
          err?.response?.data?.message || "Failed to change password";
        toast.error(errorMessage);
      },
    }
  );

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
    changePassword({
      oldPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
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
      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        toggle={() => setShowSuccessModal(false)}
        centered
      >
        <ModalBody
          className="text-center"
          style={{
            backgroundColor: "white",
            color: "black",
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
          }}
        >
          <div className="p-3">
            <svg
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_45_18996)">
                <path
                  d="M56 112C86.9279 112 112 86.9279 112 56C112 25.0721 86.9279 0 56 0C25.0721 0 0 25.0721 0 56C0 86.9279 25.0721 112 56 112Z"
                  fill="#4CAF50"
                />
                <path
                  d="M41.6904 81.2616L70.4854 110.057C94.334 103.697 112 81.9682 112 55.9998C112 55.4698 112 54.9398 112 54.4099L89.3876 33.5645L41.6904 81.2616Z"
                  fill="#128330"
                />
                <path
                  d="M57.4128 68.543C59.886 71.0162 59.886 75.256 57.4128 77.7292L52.2898 82.8522C49.8166 85.3254 45.5769 85.3254 43.1037 82.8522L20.6684 60.2402C18.1952 57.767 18.1952 53.5273 20.6684 51.0541L25.7914 45.9311C28.2646 43.4579 32.5043 43.4579 34.9775 45.9311L57.4128 68.543Z"
                  fill="white"
                />
                <path
                  d="M77.022 29.5014C79.4952 27.0282 83.7349 27.0282 86.2081 29.5014L91.3311 34.6244C93.8043 37.0976 93.8043 41.3373 91.3311 43.8105L52.4668 82.4982C49.9936 84.9714 45.7538 84.9714 43.2807 82.4982L38.1576 77.3752C35.6844 74.902 35.6844 70.6623 38.1576 68.1891L77.022 29.5014Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_45_18996">
                  <rect width="112" height="112" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h4 className="p-3">Password Updated Successfully</h4>
          <p>
            Your password has been changed. You can now log in securely with
            your new credentials
          </p>
          <div className="text-center">
            <Button
              className="p-3 mt-5 mb-3"
              style={{
                border: "none",
                width: "-webkit-fill-available",
                background: "#128330",
                color: "white",
              }}
              type="button"
              onClick={() => setShowSuccessModal(false)}
            >
              Continue
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </Container>
  );
}

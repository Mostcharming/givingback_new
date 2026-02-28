import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
  Label,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add password change logic here
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
                <Label for="currentPassword">Current Password</Label>
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
              <FormGroup className="mb-4">
                <Label for="confirmNewPassword">Confirm New Password</Label>
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
          <Button
            type="submit"
            color="success"
            style={{
              backgroundColor: "#02a95c",
              borderColor: "#02a95c",
              padding: "0.75rem 2rem",
              fontWeight: "500",
            }}
          >
            Change Password
          </Button>
        </Form>
      </CardBody>
    </Container>
  );
}

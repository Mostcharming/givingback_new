/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Row,
} from "reactstrap";
import useBackendService from "../../services/backend_service";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [decodedToken, setDecodedToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (token) {
        const decoded = atob(token);
        setDecodedToken(decoded);
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid or corrupted token.");
      navigate("/auth/forgotpassword");
    }
  }, [token, navigate]);

  const isFormValid =
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    newPassword === confirmPassword;

  const { mutate: resetPassword, isLoading } = useBackendService(
    "/auth/resetpassword",
    "POST",
    {
      onSuccess: () => {
        toast.success("Password reset successfully!");
        navigate("/auth/login");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || "Something went wrong");
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!decodedToken) {
      toast.error("Invalid token.");
      return;
    }

    resetPassword({
      token: decodedToken,
      newPassword,
    });
  };

  return (
    <>
      <Col lg="5" md="7">
        <Row className="justify-content-center text-center">
          <h5 style={{ color: "black" }}>Reset Your Password</h5>
        </Row>
        <Row className="justify-content-center text-center">
          <p className="text-lead" style={{ color: "black" }}>
            Enter your new password below.
          </p>
        </Row>
        <CardBody className="px-lg-5 py-lg-5">
          <Form role="form" onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="New Password"
                  type="password"
                  name="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </InputGroup>
            </FormGroup>

            <div className="text-center">
              <Button
                className="p-3 mt-4"
                style={{
                  border: "none",
                  color: isFormValid ? "white" : "black",
                  background: isFormValid ? "#02a95c" : "#EEEEEE",
                  width: "-webkit-fill-available",
                }}
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Loading..." : "Reset Password"}
              </Button>
            </div>
          </Form>
        </CardBody>

        <CardHeader style={{ border: "none" }} className="bg-transparent pb-3">
          <div className="btn-wrapper text-center">
            <span className="btn-inner--text">
              <Button
                color="link"
                onClick={() => navigate("/auth/login")}
                style={{ color: "#02a95c" }}
              >
                Go back
              </Button>
            </span>
          </div>
        </CardHeader>
      </Col>
    </>
  );
};

export default ResetPassword;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // Determine if both fields are filled
  const isFormValid = email.trim() !== "";

  const { mutate: forgotPassword, isLoading } = useBackendService(
    "/auth/forgotpassword",
    "POST",
    {
      onSuccess: () => {
        toast.success("Password reset email sent successfully");
        navigate("/auth/login");
      },
      onError: (error: any) => {
        toast.error(error.response.data.error);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    forgotPassword({ email });
  };

  return (
    <>
      <Col lg="5" md="7">
        <Row className="justify-content-center text-center">
          <h5 style={{ color: "black" }}>Reset Your Account Password </h5>
          <p className="text-lead" style={{ color: "black" }}>
            Enter your email address and we will send you instructions to reset
            your password.
          </p>
        </Row>
        <CardBody className="px-lg-5 py-lg-5">
          <Form role="form" onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Email"
                  type="email"
                  name="email"
                  autoComplete="new-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {isLoading ? "Loading..." : "Send mail"}
              </Button>
            </div>
          </Form>
        </CardBody>
        <CardHeader style={{ border: "none" }} className="bg-transparent pb-3">
          <div className="btn-wrapper text-center">
            <span className="btn-inner--text">
              <Link to="/auth/login" style={{ color: "#02a95c" }}>
                Go back
              </Link>
              {/* <span style={{ color: "#02a95c" }}> Sign Up</span> */}
            </span>
          </div>
        </CardHeader>
      </Col>
    </>
  );
};

export default ForgotPassword;

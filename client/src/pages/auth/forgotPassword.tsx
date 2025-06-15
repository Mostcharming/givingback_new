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
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import useBackendService from "../../services/backend_service";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Determine if both fields are filled
  const isFormValid = email.trim() !== "";

  const { mutate: forgotPassword, isLoading } = useBackendService(
    "/auth/forgotpassword",
    "POST",
    {
      onSuccess: () => {
        toast.success("Password reset email sent successfully");
        setShowModal(true);
        // navigate("/auth/login");
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
      <Modal isOpen={showModal} backdrop="static" centered>
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
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="40" cy="40" r="40" fill="#128330" />
              <path
                d="M52.2666 35.1998C52.9333 35.7065 53.3333 36.4932 53.3333 37.3332V50.6665C53.3333 51.3738 53.0523 52.052 52.5522 52.5521C52.0521 53.0522 51.3739 53.3332 50.6666 53.3332H29.3333C28.626 53.3332 27.9478 53.0522 27.4477 52.5521C26.9476 52.052 26.6666 51.3738 26.6666 50.6665V37.3332C26.6666 36.9192 26.763 36.5109 26.9482 36.1406C27.1333 35.7703 27.4021 35.4482 27.7333 35.1998L38.4 27.1998C38.8616 26.8536 39.423 26.6665 40 26.6665C40.5769 26.6665 41.1384 26.8536 41.6 27.1998L52.2666 35.1998Z"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M53.3333 37.3335L41.3733 44.9335C40.9617 45.1914 40.4857 45.3282 40 45.3282C39.5142 45.3282 39.0383 45.1914 38.6266 44.9335L26.6666 37.3335"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h4 className="p-3">Email verification</h4>
          <p>
            If an account exists with the email <strong>{email}</strong>, a
            password reset email will be sent shortly. If you don't receive it,
            please check whether you may have used a different email address
            when creating your account.
          </p>

          <div className="text-center">
            <Button
              className="p-3 mt-5 mb-3"
              style={{
                border: "none",
                width: "-webkit-fill-available",
                background: "#02a95c",
                color: "white",
              }}
              type="button"
              onClick={() => navigate("/auth/login")}
            >
              Continue
            </Button>
          </div>
        </ModalBody>
      </Modal>
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkDispatch } from "@reduxjs/toolkit";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import google from "../../assets/images/auth/google.svg";
import useBackendService from "../../services/backend_service";
import firebaseApp from "../../services/firebase";
import {
  clearAuthState,
  login_auth,
  logout_auth,
} from "../../store/reducers/authReducer";
import { clearCurrentState } from "../../store/reducers/userReducer";
import { RootState } from "../../types";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: logout } = useBackendService("/auth/logout", "GET", {
    onSuccess: () => {
      dispatch(logout_auth());
      dispatch(clearAuthState());

      // Clear current state
      dispatch(clearCurrentState());
    },
    onError: () => {},
  });
  // Add at the top, inside the component
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Determine if both fields are filled
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const { mutate: login, isLoading } = useBackendService(
    "/auth/login",
    "POST",
    {
      onSuccess: (response: any) => {
        toast.success("Logged in successfully");
        dispatch(login_auth(response));
        navigate("/dashboard");
      },
      onError: (error: any) => {
        toast.error(error.response.data.error);
      },
    }
  );

  useEffect(() => {
    logout({});
  }, [dispatch]);

  const provider = new GoogleAuthProvider();
  const auth = getAuth(firebaseApp);

  const withGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const email = result.user.email!;
        const password = "";
        const uuid = "giveback";
        login({ email, password, uuid });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const uuid = "";
    login({ email, password, uuid });
  };

  return (
    <>
      <Col lg="5" md="7">
        <Row className="justify-content-center">
          <h5 style={{ color: "black" }}>Welcome to GivingBack </h5>
          <p className="text-lead" style={{ color: "black" }}>
            Please enter your details to continue to your account{" "}
          </p>
        </Row>

        <CardBody className="mt-4 px-lg-3 py-lg-3">
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
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#F2F2F2",
                      height: "100%",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
            <a href="/auth/forgot_password" className="">
              <span style={{ color: "#34A853" }} className="">
                Forgot password?
              </span>
            </a>
            <div className="text-center">
              <Button
                className="p-3 mt-4"
                style={{
                  border: "none",
                  color: isFormValid ? "white" : "black",
                  background: isFormValid ? "#34A853" : "#EEEEEE",
                  width: "-webkit-fill-available",
                }}
                type="submit"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Loading..." : "Continue"}
              </Button>
            </div>
          </Form>
        </CardBody>
        <div
          className="text-center my-3"
          style={{ display: "flex", alignItems: "center" }}
        >
          <hr style={{ flex: 1, borderTop: "1px solid #ccc" }} />
          <span style={{ margin: "0 10px", color: "#999" }}>or</span>
          <hr style={{ flex: 1, borderTop: "1px solid #ccc" }} />
        </div>
        <CardHeader style={{ border: "none" }} className="bg-transparent pb-3">
          <div className="btn-wrapper text-center">
            <Button
              className="btn-neutral btn-icon"
              color="default"
              onClick={withGoogle}
              style={{
                cursor: "pointer",
                padding: "13px",
                width: "100%",
              }}
            >
              <span className="btn-inner--icon">
                <img src={google} alt="Google Sign-In" />
              </span>
              <span className="btn-inner--text">Sign in with Google</span>
            </Button>
          </div>
        </CardHeader>
        <CardHeader style={{ border: "none" }} className="bg-transparent pb-3">
          <div className="btn-wrapper text-center">
            <span className="btn-inner--text">
              Don't have an account?{" "}
              <Link to="/auth/register" style={{ color: "#34A853" }}>
                Sign Up
              </Link>
              {/* <span style={{ color: "#34A853" }}> Sign Up</span> */}
            </span>
          </div>
        </CardHeader>
      </Col>
    </>
  );
};

export default Login;

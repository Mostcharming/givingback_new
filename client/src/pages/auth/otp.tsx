import { ThunkDispatch } from "@reduxjs/toolkit";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
} from "reactstrap";
import useBackendService from "../../services/backend_service";
import { update_user_status } from "../../store/reducers/authReducer";
import { RootState } from "../../types";

const OtpVerification = () => {
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch();
  const [otp, setOtp] = useState<string>("");
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyOtp, isLoading } = useBackendService(
    "/auth/verify",
    "POST",
    {
      onSuccess: () => {
        toast.success("OTP verified successfully");
        dispatch(update_user_status());
        navigate("/dashboard");
      },
      onError: (error: any) => {
        toast.error(error.response.data.error);
      },
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (value.match(/[^0-9]/)) return; // Prevent non-numeric values

    const otpArr = otp.split("");
    otpArr[index] = value;
    setOtp(otpArr.join(""));

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      const otpArr = otp.split("");
      otpArr[index - 1] = "";
      setOtp(otpArr.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/[^0-9]/g, "").slice(0, 6);

    if (pastedNumbers) {
      setOtp(pastedNumbers.padEnd(6, ""));
      if (pastedNumbers.length === 6) {
        inputRefs.current[5]?.focus();
      } else {
        inputRefs.current[pastedNumbers.length]?.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verifyOtp({ otp });
  };

  return (
    <Col lg="5" md="7">
      <Card className="shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <small>Enter the 6-digit OTP sent to your email</small>
          </div>
          <Form role="form" onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <div className="d-flex justify-content-center">
                {[...Array(6)].map((_, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    innerRef={(el: any) => (inputRefs.current[index] = el)}
                    style={{
                      width: "50px",
                      height: "50px",
                      margin: "0 5px",
                      textAlign: "center",
                      fontSize: "18px",
                    }}
                    required
                  />
                ))}
              </div>
            </FormGroup>
            <div className="text-center">
              <Button
                // onClick={submit}
                className="p-3 mt-4"
                style={{
                  border: "none",
                  color: "white",
                  background: "#02a95c",
                  width: "-webkit-fill-available",
                }}
                // type="submit"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <Row className="mt-3">
        <Col xs="6">
          <Link to="/auth/login">
            <small style={{ color: "black" }}>Back to Login</small>
          </Link>
        </Col>
      </Row>
    </Col>
  );
};

export default OtpVerification;

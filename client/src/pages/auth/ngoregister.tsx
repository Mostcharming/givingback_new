import { ThunkDispatch } from "@reduxjs/toolkit";
import { HandHeart, Handshake } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { clearAuthState } from "../../store/reducers/authReducer";
import { clearCurrentState } from "../../store/reducers/userReducer";
import { RootState } from "../../types";
import "./index.css";

const Register = () => {
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch();

  useEffect(() => {
    dispatch(clearAuthState());
    dispatch(clearCurrentState());
  }, []);

  const [selectedOption, setSelectedOption] = useState<string | null>("donor");
  const [step, setStep] = useState(1);

  const handleNext = () => {
    // Only allow next if step 1 and option selected
    if (step === 1 && selectedOption) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  // const handleBack = () => {
  //   if (step > 1) {
  //     setStep(step - 1);
  //   }
  // };

  const renderStepIndicator = () => (
    <Row>
      <div className="step-indicator d-flex justify-content-center mb-5">
        {[1, 2, 3].map((s) => (
          <>
            <div
              className={`step ${step >= s ? "active" : ""} ${
                step === s ? "current" : ""
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className="step-line"></div>}
          </>
        ))}
      </div>
    </Row>
  );

  const renderStepOne = () => (
    <>
      <Row className="justify-content-center">
        <h5 style={{ color: "black" }}>
          How are you planning to use GivingBack?
        </h5>
      </Row>
      <Row className="justify-content-center">
        <p className="text-lead" style={{ color: "black" }}>
          We would streamline your setup experience accordingly
        </p>
      </Row>
      <Row style={{ width: "70vw" }} className="mt-5">
        <Col md={6} className="mb-3 mb-md-0">
          <Card
            className={`option-card ${
              selectedOption === "donor" ? "active" : ""
            }`}
            onClick={() => setSelectedOption("donor")}
          >
            <CardBody>
              <div className="icon-container mb-3">
                <HandHeart size={32} />
              </div>
              <h3 className="option-title mb-3">Join as a donor</h3>
              <p className="option-text">
                Use GivingBack to donate and impact people's lives by finding
                the right cause and organization
              </p>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card
            className={`option-card ${
              selectedOption === "organization" ? "active" : ""
            }`}
            onClick={() => setSelectedOption("organization")}
          >
            <CardBody>
              <div className="icon-container mb-3">
                <Handshake size={32} />
              </div>
              <h3 className="option-title mb-3">Join as an organization</h3>
              <p className="option-text">
                Use GivingBack to empower your organization, post causes and get
                funded.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <div className="text-center">
        <Button
          className="p-3 mt-5 mb-3"
          style={{
            border: "none",
            width: "-webkit-fill-available",
            background: selectedOption ? "#02a95c" : "#EEEEEE",
            color: selectedOption ? "white" : "black",
          }}
          type="button"
          disabled={!selectedOption}
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      {selectedOption === "donor" ? (
        <>
          {" "}
          <Row className="justify-content-center">
            <h5 style={{ color: "black" }}>
              {selectedOption === "donor"
                ? "Donor Registration Form"
                : "Organization Registration Form"}
            </h5>
          </Row>
          <Row className="justify-content-center">
            <p>Step 2 form for: {selectedOption}</p>
          </Row>
          <div className="text-center">
            <Button
              onClick={handleNext}
              className="p-3 mt-4"
              style={{
                border: "none",
                color: "white",
                background: "#02a95c",
                width: "-webkit-fill-available",
              }}
              type="submit"
            >
              Continue
            </Button>
          </div>
        </>
      ) : (
        <>
          {" "}
          <Row className="justify-content-center">
            <h5 style={{ color: "black" }}>
              {selectedOption === "donor"
                ? "Donor Registration Form"
                : "Organization Registration Form"}
            </h5>
          </Row>
          <Row className="justify-content-center">
            <p>Step 2 form for: {selectedOption}</p>
          </Row>
          <div className="text-center">
            <Button
              onClick={handleNext}
              className="p-3 mt-4"
              style={{
                border: "none",
                color: "white",
                background: "#02a95c",
                width: "-webkit-fill-available",
              }}
              type="submit"
            >
              Continue
            </Button>
          </div>
        </>
      )}
    </>
  );

  const renderStepThree = () => (
    <>
      {selectedOption === "donor" ? (
        <>
          {" "}
          <Row className="justify-content-center">
            <h5 style={{ color: "black" }}>
              {selectedOption === "donor"
                ? "Donor Registration Form"
                : "Organization Registration Form"}
            </h5>
          </Row>
          <Row className="justify-content-center">
            <p>Step 2 form for: {selectedOption}</p>
          </Row>
          <div className="text-center">
            <Button
              onClick={handleNext}
              className="p-3 mt-4"
              style={{
                border: "none",
                color: "white",
                background: "#02a95c",
                width: "-webkit-fill-available",
              }}
              type="submit"
            >
              Continue
            </Button>
          </div>
        </>
      ) : (
        <>
          {" "}
          <Row className="justify-content-center">
            <h5 style={{ color: "black" }}>
              {selectedOption === "donor"
                ? "Donor Registration Form"
                : "Organization Registration Form"}
            </h5>
          </Row>
          <Row className="justify-content-center">
            <p>Step 2 form for: {selectedOption}</p>
          </Row>
          <div className="text-center">
            <Button
              onClick={handleNext}
              className="p-3 mt-4"
              style={{
                border: "none",
                color: "white",
                background: "#02a95c",
                width: "-webkit-fill-available",
              }}
              type="submit"
            >
              Continue
            </Button>
          </div>
        </>
      )}
    </>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      case 3:
        return renderStepThree();
      default:
        return null;
    }
  };

  return (
    <div>
      {renderStepIndicator()}
      {renderCurrentStep()}
      <CardHeader
        style={{ border: "none" }}
        className="mt-3 bg-transparent pb-3"
      >
        <div className="btn-wrapper text-center">
          <span className="btn-inner--text">
            Already have an account?{" "}
            <Link to="/auth/login" style={{ color: "#02a95c" }}>
              Sign In
            </Link>
          </span>
        </div>
      </CardHeader>
    </div>
  );
};

export default Register;

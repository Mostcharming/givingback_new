/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkDispatch } from "@reduxjs/toolkit";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { HandHeart, Handshake } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  Row,
} from "reactstrap";
import google from "../../assets/images/auth/google.svg";
import firebaseApp from "../../services/firebase";
import { clearAuthState } from "../../store/reducers/authReducer";
import { clearCurrentState } from "../../store/reducers/userReducer";
import { RootState } from "../../types";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../../components/home/loading";
import useBackendService from "../../services/backend_service";
import Util from "../../services/utils";
import "./index.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch();

  useEffect(() => {
    dispatch(clearAuthState());
    dispatch(clearCurrentState());
    getAreas({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [formData, setFormData] = useState({
    selectedOption: "",
    email: "",
    password: "",
    category: "",
    country: "",
    state: "",
    userType: "",
    cpassword: "",
    name: "",
    interest_area: "",
    orgemail: "",
    orgphone: "",
    phone: "",
    cac: "",
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [step, setStep] = useState(1);

  const provider = new GoogleAuthProvider();
  const auth = getAuth(firebaseApp);
  const [showPassword, setShowPassword] = useState(false);
  const [areas, setAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const { mutate: getAreas } = useBackendService("/areas", "GET", {
    onSuccess: (res2: any) => {
      setAreas(res2 as any[]);
    },
    onError: () => {},
  });
  const onThematicAreaChange = (event: { value: string; label: string }[]) => {
    const interest_area = event.map((item) => item.value).join(",");

    setFormData((prev) => ({
      ...prev,
      interest_area: interest_area,
    }));
  };

  const withGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setFormData((prev) => ({
          ...prev,
          email: result.user.email!,
          password: "",
          uuid: "giveback",
        }));
        if (formData.selectedOption === "donor") {
          if (formData.userType) {
            setStep(3);
          } else {
            toast.error("Please select user type");
          }
        } else {
          setStep(3);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleNext = () => {
    const { email, password, cpassword } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // All validation passed, proceed
    if (step === 1 && formData.selectedOption) {
      setStep(2);
    } else if (step === 2) {
      if (!email || !password || !cpassword) {
        toast.error("All fields are required");
        return;
      }

      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      if (password !== cpassword) {
        toast.error("Passwords do not match");
        return;
      }
      setStep(3);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    const input = document.getElementById("fileInput") as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  const { mutate: submitDonorForm, isLoading } = useBackendService(
    "/auth/new/onboard",
    "POST",
    {
      onSuccess: () => {
        toast.success("Signed up successfully!");
        setShowModal(true);
        // navigate("/dashboard");
      },
      onError: () => {
        toast.error("Form submission failed");
      },
    }
  );
  const submit = () => {
    const finalFormData = new FormData();

    Object.keys(formData).forEach((key) => {
      finalFormData.append(key, formData[key]);
    });
    finalFormData.append("userimg", file);
    submitDonorForm(finalFormData);
  };

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
              formData.selectedOption === "donor" ? "active" : ""
            }`}
            onClick={() =>
              // toast.info("Only NGO sign up is enabled at the moment")
              setFormData((prev) => ({
                ...prev,
                selectedOption: "donor",
              }))
            }
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
              formData.selectedOption === "organization" ? "active" : ""
            }`}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                selectedOption: "organization",
              }))
            }
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
            background: formData.selectedOption ? "#02a95c" : "#EEEEEE",
            color: formData.selectedOption ? "white" : "black",
          }}
          type="button"
          disabled={!formData.selectedOption}
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      {formData.selectedOption === "donor" ? (
        <>
          <Row className="justify-content-center">
            <h5 style={{ color: "black" }}>
              Get started with your donor account
            </h5>
          </Row>
          <Row className="justify-content-center">
            <p>Please register your personal details to create account.</p>
          </Row>
          <CardBody className="mt-4 px-lg-3 py-lg-3">
            <div style={{ width: "55vw" }} role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <select
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="form-control p-3"
                    name="userType"
                    required
                    value={formData.userType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        userType: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Please select user type
                    </option>
                    <option value="individual">
                      Individual donor (personal giving)
                    </option>
                    <option value="corporate">
                      Corporate donor (representing a business or an
                      organization)
                    </option>
                  </select>
                </InputGroup>
              </FormGroup>

              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
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
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
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
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    name="cpassword"
                    autoComplete="new-password"
                    required
                    value={formData.cpassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cpassword: e.target.value,
                      }))
                    }
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
              <div className="text-center">
                <Button
                  onClick={handleNext}
                  className="p-3 mt-4"
                  disabled={
                    !formData.userType || !formData.email || !formData.password
                  }
                  style={{
                    border: "none",
                    color: formData.userType ? "white" : "black",
                    background: formData.userType ? "#02a95c" : "#EEEEEE",
                    width: "-webkit-fill-available",
                  }}
                  // type="submit"
                >
                  Continue
                </Button>
              </div>
            </div>
          </CardBody>
          <div
            className="text-center my-3"
            style={{ display: "flex", alignItems: "center" }}
          >
            <hr style={{ flex: 1, borderTop: "1px solid #ccc" }} />
            <span style={{ margin: "0 10px", color: "#999" }}>or</span>
            <hr style={{ flex: 1, borderTop: "1px solid #ccc" }} />
          </div>
          <CardHeader
            style={{ border: "none" }}
            className="bg-transparent pb-3"
          >
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
                <span className="btn-inner--text">Sign Up with Google</span>
              </Button>
            </div>
          </CardHeader>
        </>
      ) : (
        <>
          <Row className="justify-content-center">
            <h5 style={{ color: "black" }}>
              Get started with your organization account
            </h5>
          </Row>
          <Row className="justify-content-center">
            <p>Please register your personal details to create account.</p>
          </Row>
          <CardBody className="mt-4 px-lg-3 py-lg-3">
            <div style={{ width: "55vw" }} role="form">
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
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
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
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
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    name="cpassword"
                    autoComplete="new-password"
                    required
                    value={formData.cpassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cpassword: e.target.value,
                      }))
                    }
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
              <div className="text-center">
                <Button
                  disabled={!formData.email || !formData.password}
                  onClick={handleNext}
                  className="p-3 mt-4"
                  style={{
                    border: "none",
                    color: "white",
                    background: "#02a95c",
                    width: "-webkit-fill-available",
                  }}
                  // type="submit"
                >
                  Continue
                </Button>
              </div>
            </div>
          </CardBody>
          <div
            className="text-center my-3"
            style={{ display: "flex", alignItems: "center" }}
          >
            <hr style={{ flex: 1, borderTop: "1px solid #ccc" }} />
            <span style={{ margin: "0 10px", color: "#999" }}>or</span>
            <hr style={{ flex: 1, borderTop: "1px solid #ccc" }} />
          </div>
          <CardHeader
            style={{ border: "none" }}
            className="bg-transparent pb-3"
          >
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
                <span className="btn-inner--text">Sign Up with Google</span>
              </Button>
            </div>
          </CardHeader>
        </>
      )}
    </>
  );

  const renderStepThree = () => (
    <>
      {formData.selectedOption === "donor" ? (
        <>
          {formData.userType === "individual" ? (
            <>
              <Row className="justify-content-center">
                <h5 style={{ color: "black" }}>Basic information</h5>
              </Row>
              <Row className="justify-content-center">
                <p>
                  Please complete the form to help us personalize your giving
                  experience.
                </p>
              </Row>
              <CardBody className="mt-4 px-lg-3 py-lg-3">
                <div style={{ width: "55vw" }} role="form">
                  <FormGroup className="mb-3">
                    <div
                      style={{
                        border: "2px dotted #ccc",
                        borderRadius: "8px",
                        padding: "40px",
                        textAlign: "center",
                        cursor: "pointer",
                        backgroundColor: "#F9F9F9",
                        position: "relative",
                      }}
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      {previewUrl ? (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "200px",
                              borderRadius: "10px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent click
                              removeFile();
                            }}
                            style={{
                              position: "absolute",
                              top: "-10px",
                              right: "-10px",
                              background: "#ff4d4f",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <svg
                              width="47"
                              height="46"
                              viewBox="0 0 47 46"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M17.3017 10.1683C17.2831 10.1363 17.2739 10.1203 17.2556 10.0921C16.8786 9.50869 16.042 9.28594 15.4224 9.60397C15.3924 9.61932 15.3829 9.62482 15.3639 9.63576L11.4043 11.9097C10.421 12.4744 9.6094 12.9405 8.97949 13.3739C8.32524 13.824 7.76356 14.3063 7.34509 14.9473C6.69614 15.9413 6.38021 17.1141 6.44257 18.2977C6.48278 19.0609 6.72679 19.7579 7.06713 20.4732C7.3948 21.1618 7.86337 21.9691 8.4311 22.9472L15.8243 35.6848C16.392 36.6629 16.8605 37.4702 17.2962 38.0968C17.7488 38.7476 18.2336 39.3063 18.878 39.7226C19.8773 40.3681 21.0564 40.6824 22.2463 40.6203C23.0135 40.5803 23.7142 40.3376 24.4333 39.9991C25.1256 39.6731 25.9371 39.207 26.9204 38.6423L34.8395 34.0944C35.8228 33.5297 36.6344 33.0637 37.2643 32.6303C37.9186 32.1801 38.4803 31.6979 38.8987 31.0569C39.5477 30.0629 39.8636 28.89 39.8012 27.7064C39.761 26.9432 39.517 26.2462 39.1767 25.531C38.849 24.8423 38.3804 24.0351 37.8127 23.057L32.7055 14.2578C32.6946 14.2389 32.6891 14.2295 32.6709 14.2013C32.2941 13.6176 31.4576 13.3945 30.8377 13.7123C30.8078 13.7276 30.7918 13.7368 30.7598 13.7552L25.3648 16.8535C25.0565 17.0306 24.7563 17.2031 24.49 17.3285C24.1976 17.4661 23.837 17.6018 23.4079 17.6242C22.813 17.6552 22.2234 17.4981 21.7238 17.1753C21.3634 16.9425 21.1193 16.6457 20.9353 16.381C20.7677 16.14 20.5944 15.8413 20.4164 15.5346L17.3017 10.1683ZM18.9409 27.0234C18.2662 27.4108 18.0351 28.269 18.4246 28.94C18.8141 29.6111 19.6768 29.8411 20.3514 29.4536L30.1241 23.8412C30.7987 23.4538 31.0299 22.5957 30.6404 21.9246C30.2508 21.2535 29.3882 21.0235 28.7135 21.411L18.9409 27.0234ZM21.762 31.8839C21.0873 32.2713 20.8562 33.1294 21.2457 33.8005C21.6352 34.4716 22.4979 34.7015 23.1725 34.3141L30.502 30.1048C31.1767 29.7173 31.4078 28.8592 31.0183 28.1881C30.6288 27.517 29.7661 27.2871 29.0915 27.6746L21.762 31.8839Z"
                                fill="#016741"
                              />
                              <path
                                d="M28.0341 12.0802C28.3928 11.8742 28.5721 11.7712 28.667 11.5973C28.8011 11.3516 28.7521 10.9823 28.5586 10.7796C28.4216 10.636 28.2372 10.587 27.8684 10.4889L21.4475 8.77748C21.0788 8.67901 20.8944 8.62978 20.7036 8.68594C20.4341 8.76526 20.2061 9.06073 20.1987 9.34015C20.1934 9.53802 20.297 9.71641 20.504 10.0732L22.696 13.8497C22.8935 14.1899 22.9922 14.3601 23.1342 14.4518C23.2591 14.5325 23.4065 14.5718 23.5553 14.564C23.7243 14.5552 23.8954 14.457 24.2375 14.2605L28.0341 12.0802Z"
                                fill="#016741"
                              />
                            </svg>
                          </div>
                          <p style={{ marginTop: "10px", color: "#555" }}>
                            Upload your profile picture
                          </p>
                        </>
                      )}
                      <input
                        id="fileInput"
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <Input
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="p-3"
                        placeholder="Full name"
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

                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <Select
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "#F2F2F2",
                            minHeight: "100%",
                            height: "100%",
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
                            height: "55px",
                          }),
                        }}
                        className="w-100"
                        placeholder="Area of interest"
                        required
                        onChange={onThematicAreaChange}
                        options={areas.map((category) => ({
                          value: category.name,
                          label: category.name,
                        }))}
                        isMulti
                      />
                    </InputGroup>
                  </FormGroup>

                  <div className="text-center">
                    <Button
                      onClick={submit}
                      disabled={!formData.name || !formData.interest_area}
                      className="p-3 mt-4"
                      style={{
                        border: "none",
                        color: "white",
                        background: "#02a95c",
                        width: "-webkit-fill-available",
                      }}
                      // type="submit"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </CardBody>
              <div
                className="text-center my-3"
                style={{ display: "flex", alignItems: "center" }}
              >
                <hr style={{ flex: 1, borderTop: "1px solid #ccc" }} />
                <span style={{ margin: "0 10px", color: "#999" }}>or</span>
                <hr style={{ flex: 1, borderTop: "1px solid #ccc" }} />
              </div>
              <CardHeader
                style={{ border: "none" }}
                className="bg-transparent pb-3"
              >
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
                    <span className="btn-inner--text">Sign Up with Google</span>
                  </Button>
                </div>
              </CardHeader>
            </>
          ) : (
            <>
              <Row className="justify-content-center">
                <h5 style={{ color: "black" }}>
                  Get started with your organization account
                </h5>
              </Row>
              <Row className="justify-content-center">
                <p>Please register your organization details to continue.</p>
              </Row>
              <CardBody className="mt-4 px-lg-3 py-lg-3">
                <div style={{ width: "55vw" }} role="form">
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <Input
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="p-3"
                        placeholder="Organization name"
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
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <Input
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="p-3"
                        placeholder="Organization email"
                        type="text"
                        name="orgemail"
                        autoComplete="new-email"
                        required
                        value={formData.orgemail}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            orgemail: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <select
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="form-control p-3"
                        name="country"
                        required
                        value={formData.country}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                      >
                        <option value="Nigeria">Nigeria</option>
                      </select>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <select
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="form-control p-3"
                        name="state"
                        required
                        value={formData.state}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                      >
                        <option value="" disabled>
                          Select State
                        </option>
                        {nigerianStates.map((nigerianState) => (
                          <option key={nigerianState} value={nigerianState}>
                            {nigerianState}
                          </option>
                        ))}
                      </select>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <Select
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "#F2F2F2",
                            minHeight: "100%",
                            height: "100%",
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
                            height: "55px",
                          }),
                        }}
                        className="w-100"
                        placeholder="Area of interest"
                        required
                        onChange={onThematicAreaChange}
                        options={areas.map((category) => ({
                          value: category.name,
                          label: category.name,
                        }))}
                        isMulti
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <Input
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="p-3"
                        placeholder="Organization registration number (optional)"
                        type="text"
                        name="orgphone"
                        required
                        value={formData.orgphone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            orgphone: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </FormGroup>{" "}
                  <FormGroup className="mb-3">
                    <InputGroup className="input-group-alternative">
                      <Input
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="p-3"
                        placeholder="Phone number"
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
                  <div className="text-center">
                    <Button
                      disabled={
                        !formData.orgemail ||
                        !formData.name ||
                        !formData.state ||
                        !formData.phone
                      }
                      onClick={submit}
                      className="p-3 mt-4"
                      style={{
                        border: "none",
                        color: "white",
                        background: "#02a95c",
                        width: "-webkit-fill-available",
                      }}
                      // type="submit"
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              </CardBody>
            </>
          )}
        </>
      ) : (
        <>
          <Row className="justify-content-center">
            <h5 style={{ color: "black" }}>
              Get started with your organization account
            </h5>
          </Row>
          <Row className="justify-content-center">
            <p>Please register your organization details to continue.</p>
          </Row>
          <CardBody className="mt-4 px-lg-3 py-lg-3">
            <div style={{ width: "55vw" }} role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Organization name"
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
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Organization email"
                    type="text"
                    name="orgemail"
                    required
                    value={formData.orgemail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        orgemail: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <select
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="form-control p-3"
                    name="country"
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                  >
                    <option value="Nigeria">Nigeria</option>
                  </select>
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <select
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="form-control p-3"
                    name="state"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {nigerianStates.map((nigerianState) => (
                      <option key={nigerianState} value={nigerianState}>
                        {nigerianState}
                      </option>
                    ))}
                  </select>
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <Select
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "#F2F2F2",
                        minHeight: "100%",
                        height: "100%",
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
                        height: "55px",
                      }),
                    }}
                    className="w-100"
                    placeholder="Area of interest"
                    required
                    onChange={onThematicAreaChange}
                    options={areas.map((category) => ({
                      value: category.name,
                      label: category.name,
                    }))}
                    isMulti
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Organization registration number (CAC)"
                    type="text"
                    name="cac"
                    required
                    value={formData.cac}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cac: e.target.value,
                      }))
                    }
                    onBlur={async (e) => {
                      const value = e.target.value;

                      try {
                        await Util.checkIfCompanyRegistrationNumberIsValid(
                          value
                        );

                        console.log("CAC is valid");
                        setFormData((prev) => ({
                          ...prev,
                          cac: value,
                        }));
                      } catch (err) {
                        console.log(err);
                        setFormData((prev) => ({
                          ...prev,
                          cac: "",
                        }));
                        toast.error("Invalid CAC. Validation not successful");
                      }
                    }}
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Phone number"
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
              <div className="text-center">
                <Button
                  disabled={!formData.cac || !formData.name || !formData.state}
                  onClick={submit}
                  className="p-3 mt-4"
                  style={{
                    border: "none",
                    color: "white",
                    background: "#02a95c",
                    width: "-webkit-fill-available",
                  }}
                  // type="submit"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </CardBody>
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
            We have sent you a verification link to authenticate your account.
            Kindly check your inbox or spam for the link and if you did not get
            it, please click on the resend email button
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
      {renderStepIndicator()}
      {isLoading ? <Loading type="inline" /> : <>{renderCurrentStep()}</>}

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

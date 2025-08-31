/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkDispatch } from "@reduxjs/toolkit";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Button, CardHeader, Modal, ModalBody } from "reactstrap";
import google from "../../assets/images/auth/google.svg";
import firebaseApp from "../../services/firebase";
import { clearAuthState } from "../../store/reducers/authReducer";
import { clearCurrentState } from "../../store/reducers/userReducer";
import { RootState } from "../../types";

import { toast } from "react-toastify";
import Loading from "../../components/home/loading";
import useBackendService from "../../services/backend_service";
import "./index.css";
import {
  RenderStepIndicator,
  RenderStepOne,
  RenderStepThree,
  RenderStepTwo,
} from "./steps";

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

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <RenderStepOne
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <RenderStepTwo
            formData={formData}
            setFormData={setFormData}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            handleNext={handleNext}
            withGoogle={withGoogle}
            google={google}
            submit={submit}
          />
        );
      case 3:
        return (
          <RenderStepThree
            formData={formData}
            previewUrl={previewUrl}
            removeFile={removeFile}
            handleFileChange={handleFileChange}
            setFormData={setFormData}
            onThematicAreaChange={onThematicAreaChange}
            areas={areas}
            submit={submit}
            withGoogle={withGoogle}
            google={google}
            nigerianStates={nigerianStates}
          />
        );
      default:
        return null;
    }
  };
  console.log(formData);
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
              onClick={() => navigate("/auth/verify")}
            >
              Continue
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <RenderStepIndicator step={step} setStep={setStep} />
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

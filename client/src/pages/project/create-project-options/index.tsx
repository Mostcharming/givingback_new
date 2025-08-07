import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody } from "reactstrap";
import Loading from "../../../components/home/loading";
import useBackendService from "../../../services/backend_service";
import { useContent } from "../../../services/useContext";
import Beneficiary from "./render/Beneficiary";
import Details from "./render/Details";
import Images from "./render/Images";
import MilestoneForm from "./render/mileStones";
import Progress from "./render/Progress";
import Sponsor from "./render/Sponsor";

const CreateProject = () => {
  const navigate = useNavigate();
  const { authState } = useContent();
  const role = authState.user?.role;
  const [formData, setFormData] = useState({
    //main details
    title: "",
    description: "",
    status: "",
    duration: "",
    startDate: null,
    endDate: null,
    interest_area: "",
    orgemail: "",
    cost: null,
    raised: null,
    //milestones
    milestones: [
      {
        milestone: "",
        miledes: "",
        mstartDate: "",
        mendDate: "",
        mstatus: "",
      },
    ],
    //sponsor
    sponsors: [
      {
        sponsor: "",
        logoFile: null,
        sdesc: "",
      },
    ],
    //beneficiaries
    beneficiaries: [
      {
        name: "",
        contact: "",
        address: "",
      },
    ],
    images: [],
  });
  const [step, setStep] = useState(1);

  const progressSteps = [
    { name: "Project details", completed: step > 1 },
    { name: "Timeline & Milestones", completed: step > 2 },
    { name: "Project sponsor", completed: step > 3 },
    { name: "Project beneficiaries", completed: step > 4 },
    { name: "Project media", completed: step > 5 },
  ];
  const [areas, setAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { mutate: getAreas } = useBackendService("/areas", "GET", {
    onSuccess: (res2: unknown) => {
      setAreas(res2 as unknown[]);
    },
    onError: () => {},
  });
  useEffect(() => {
    getAreas({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onThematicAreaChange = (event: { value: string; label: string }[]) => {
    const interest_area = event.map((item) => item.value).join(",");

    setFormData((prev) => ({
      ...prev,
      interest_area: interest_area,
    }));
  };
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };
  const handleBackStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
  };
  const handleExit = () => {
    switch (role) {
      case "admin":
        navigate(`/admin/projects`);
        break;
      case "donor":
      case "corporate":
        navigate(`/donor/projects`);
        break;
      case "NGO":
        navigate(`/ngo/projects`);
        break;
      default:
        console.log("Invalid role or no role found");
    }
  };

  const { mutate: submitProject, isLoading: isSubmitting } = useBackendService(
    "/ngo/project_v2",
    "POST",
    {
      onSuccess: () => {
        setShowModal(true);
      },
      onError: () => {
        toast.error("Error submitting form");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();

    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("status", formData.status);
    form.append("duration", formData.duration);
    form.append("startDate", formData.startDate || "");
    form.append("endDate", formData.endDate || "");
    form.append("interest_area", formData.interest_area);
    form.append("orgemail", formData.orgemail);
    form.append("cost", formData.cost ?? "");
    form.append("raised", formData.raised ?? "");

    formData.milestones.forEach((milestone, i) => {
      form.append(`milestones[${i}][milestone]`, milestone.milestone);
      form.append(`milestones[${i}][ miledes]`, milestone.miledes);
      form.append(`milestones[${i}][mstartDate]`, milestone.mstartDate);
      form.append(`milestones[${i}][mendDate]`, milestone.mendDate);
      form.append(`milestones[${i}][ mstatus]`, milestone.mstatus);
    });

    formData.sponsors.forEach((sponsor, i) => {
      form.append(`sponsors[${i}][sponsor]`, sponsor.sponsor);
      form.append(`sponsors[${i}][sdesc]`, sponsor.sdesc);
      if (sponsor.logoFile) {
        form.append(`sponsors[${i}][logoFile]`, sponsor.logoFile);
      }
    });

    formData.beneficiaries.forEach((beneficiaries, i) => {
      form.append(`beneficiaries[${i}][name]`, beneficiaries.name);
      form.append(`beneficiaries[${i}][contact]`, beneficiaries.contact);

      form.append(`beneficiaries[${i}][address]`, beneficiaries.address);
    });

    // Append images
    formData.images.forEach((img, i) => {
      if (img?.file) {
        form.append(`images[${i}]`, img.file);
      }
    });

    submitProject(form);
  };
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return (
          <Details
            formData={formData}
            setFormData={setFormData}
            handleExit={handleExit}
            handleNextStep={handleNextStep}
            onThematicAreaChange={onThematicAreaChange}
            areas={areas}
          />
        );
      case 2:
        return (
          <MilestoneForm
            formData={formData}
            setFormData={setFormData}
            handleNextStep={handleNextStep}
            handleBackStep={handleBackStep}
          />
        );
      case 3:
        return (
          <Sponsor
            formData={formData}
            setFormData={setFormData}
            handleNextStep={handleNextStep}
            handleBackStep={handleBackStep}
          />
        );
      case 4:
        return (
          <Beneficiary
            formData={formData}
            setFormData={setFormData}
            handleNextStep={handleNextStep}
            handleBackStep={handleBackStep}
          />
        );
      case 5:
        return (
          <Images
            formData={formData}
            setFormData={setFormData}
            handleNextStep={handleSubmit}
            handleBackStep={handleBackStep}
            isLoading={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-vh-100">
      {isSubmitting && <Loading type={"inline"} />}

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
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_45_11265)">
                <path
                  d="M56 112C86.9279 112 112 86.9279 112 56C112 25.0721 86.9279 0 56 0C25.0721 0 0 25.0721 0 56C0 86.9279 25.0721 112 56 112Z"
                  fill="#4CAF50"
                />
                <path
                  d="M41.6914 81.2616L70.4864 110.057C94.3349 103.697 112.001 81.9682 112.001 55.9998C112.001 55.4698 112.001 54.9398 112.001 54.4099L89.3886 33.5645L41.6914 81.2616Z"
                  fill="#128330"
                />
                <path
                  d="M57.4138 68.5421C59.887 71.0153 59.887 75.255 57.4138 77.7282L52.2908 82.8512C49.8176 85.3244 45.5779 85.3244 43.1047 82.8512L20.6693 60.2392C18.1962 57.766 18.1962 53.5263 20.6693 51.0531L25.7924 45.9301C28.2656 43.4569 32.5053 43.4569 34.9785 45.9301L57.4138 68.5421Z"
                  fill="white"
                />
                <path
                  d="M77.022 29.5014C79.4952 27.0282 83.7349 27.0282 86.2081 29.5014L91.3311 34.6244C93.8043 37.0976 93.8043 41.3373 91.3311 43.8105L52.4668 82.4982C49.9936 84.9714 45.7538 84.9714 43.2807 82.4982L38.1576 77.3752C35.6844 74.902 35.6844 70.6623 38.1576 68.1891L77.022 29.5014Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_45_11265">
                  <rect width="112" height="112" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h4 className="p-3">Project uploaded successfully</h4>
          <p>
            Your project has been uploaded and is now live. You can view or
            share it anytime.
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
              onClick={handleExit}
            >
              Continue
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <div className="container-fluid ">
        <div className="row">
          <div className="col-lg-8 py-4">
            <nav style={{ background: "white" }} aria-label="" className="mb-4">
              <ol style={{ background: "white", display: "flex" }} className="">
                <li className="">
                  <a className="text-decoration-none text-muted">Projects </a>
                </li>
                <ChevronRight style={{ marginTop: "1px", width: "1.2rem" }} />
                <li style={{ color: "black" }} className="" aria-current="page">
                  Add past project
                </li>
              </ol>
            </nav>
            {renderCurrentStep()}
          </div>
          <Progress progressSteps={progressSteps} />
        </div>
      </div>
    </div>
  );
};
export default CreateProject;

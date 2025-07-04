import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBackendService from "../../../services/backend_service";
import { useContent } from "../../../services/useContext";
import Beneficiary from "./render/Beneficiary";
import Details from "./render/Details";
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

  const { mutate: getAreas } = useBackendService("/areas", "GET", {
    onSuccess: (res2: any) => {
      setAreas(res2 as any[]);
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
    console.log(formData);
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

      default:
        return null;
    }
  };

  return (
    <div className="min-vh-100">
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

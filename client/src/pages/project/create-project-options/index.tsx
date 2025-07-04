import { ChevronRight, CircleCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import useBackendService from "../../../services/backend_service";
import { useContent } from "../../../services/useContext";

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
  });
  const [step, setStep] = useState(1);
  const [areas, setAreas] = useState([]);

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

  useEffect(() => {
    getAreas({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressSteps = [
    { name: "Project details", completed: step > 1 },
    { name: "Timeline & Milestones", completed: step > 2 },
    { name: "Project sponsor", completed: step > 3 },
    { name: "Project beneficiaries", completed: step > 4 },
    { name: "Project media", completed: step > 5 },
  ];
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
  const renderProgress = () => {
    return (
      <div
        style={{ borderLeft: "1px solid #cecece", height: "100vh" }}
        className="col-lg-4 d-none d-lg-block py-4"
      >
        <div className="position-sticky" style={{ top: "2rem" }}>
          <div className="text-end pt-4 pl-2 pr-4">
            <h5 className="text-decoration-none text-muted">
              Add past project
            </h5>
          </div>
          <div className="bg-white rounded-3 pt-4 pl-2 pr-4">
            <div className="list-group list-group-flush">
              {progressSteps.map((step, index) => (
                <div
                  key={index}
                  className="list-group-item border-0 px-0 py-2.5"
                >
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {step.completed ? (
                        <div
                          className=" d-flex align-items-center justify-content-center"
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "#198754",
                            fontSize: "12px",
                          }}
                        >
                          <CircleCheckBig
                            style={{
                              width: "1.3rem",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className=""
                          style={{
                            width: "24px",
                            height: "24px",
                            borderColor: "#dee2e6",
                          }}
                        >
                          <CircleCheckBig
                            style={{
                              width: "1.3rem",
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <span
                      className={
                        step.completed
                          ? "text-success ml-3 fw-medium"
                          : "text-muted ml-3"
                      }
                    >
                      {step.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderDetails();
      case 2:
        return renderDetails();
      case 3:
        return renderDetails();
      case 4:
        return renderDetails();
      case 5:
        return renderDetails();
      default:
        return null;
    }
  };
  const renderDetails = () => {
    return (
      <div className="">
        <div className="mb-4">
          <h2 style={{ color: "black" }} className="h4 fw-bold mb-2">
            Project details
          </h2>
          <p className="text-muted mb-0">Add details about your project here</p>
        </div>

        <form className="pr-5">
          <FormGroup className="">
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Project title"
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </InputGroup>
          </FormGroup>
          <FormGroup className="mt-4">
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Project description"
                type="textarea"
                name="description"
                rows={5}
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </InputGroup>
          </FormGroup>
          <div className="row mt-4">
            <div className="col-md-6">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <select
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="form-control p-3"
                    name="status"
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Project Status
                    </option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </InputGroup>
              </FormGroup>
            </div>

            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <FormGroup>
                    <label className="mb-1">Start date</label>

                    <InputGroup className="input-group-alternative">
                      <Input
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="p-3"
                        placeholder="Project duration"
                        type="date"
                        name="duration"
                        rows={5}
                        required
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup>
                    <label className="mb-1">End date</label>
                    <InputGroup className="input-group-alternative">
                      <Input
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="p-3"
                        placeholder="Project duration"
                        type="date"
                        name="endDate"
                        rows={5}
                        required
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>
          <FormGroup className="mt-4">
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
                placeholder="Select related fields"
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
          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Project cost (NGN)"
                    type="number"
                    name="cost"
                    rows={5}
                    required
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cost: e.target.value,
                      }))
                    }
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText
                      style={{
                        backgroundColor: "#F2F2F2",
                        height: "100%",
                      }}
                    >
                      | NGN
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Amount raised (NGN)"
                    type="number"
                    name="raised"
                    rows={5}
                    required
                    value={formData.raised}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        raised: e.target.value,
                      }))
                    }
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText
                      style={{
                        backgroundColor: "#F2F2F2",
                        height: "100%",
                      }}
                    >
                      | NGN
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormGroup>
            </div>
          </div>
          <FormGroup className="">
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Project manager's email"
                type="email"
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

          <div className="d-flex justify-content-between pt-4">
            <button
              onClick={handleExit}
              type="button"
              className="btn btn-outline-success px-5 py-3"
            >
              Exit
            </button>
            <Button
              onClick={handleNextStep}
              className="btn px-5 py-3"
              disabled={
                !formData.title ||
                !formData.description ||
                !formData.status ||
                !formData.duration ||
                !formData.endDate ||
                !formData.cost ||
                !formData.raised ||
                !formData.orgemail ||
                !formData.interest_area
              }
              style={{
                border: "none",
                background: "#02a95c",
              }}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    );
  };
  const renderMilestones = () => {
    return (
      <div className="">
        <div className="mb-4">
          <h2 style={{ color: "black" }} className="h4 fw-bold mb-2">
            Timeline & Milestone
          </h2>
          <p className="text-muted mb-0">
            Add details about completing the project
          </p>
        </div>

        <form className="pr-5">
          <FormGroup className="">
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Milestone title"
                type="text"
                name="title"
                required
                // value={formData.milestone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    milestone: e.target.value,
                  }))
                }
              />
            </InputGroup>
          </FormGroup>
          <FormGroup className="mt-4">
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Project description"
                type="textarea"
                name="description"
                rows={5}
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </InputGroup>
          </FormGroup>
          <div className="row mt-4">
            <div className="col-md-6">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <select
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="form-control p-3"
                    name="status"
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Project Status
                    </option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </InputGroup>
              </FormGroup>
            </div>

            <div className="col-md-6">
              <div className="row">
                {" "}
                <div className="col-md-6">
                  <FormGroup>
                    <label className="mb-1">Start date</label>

                    <InputGroup className="input-group-alternative">
                      <Input
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="p-3"
                        placeholder="Project duration"
                        type="date"
                        name="duration"
                        rows={5}
                        required
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                </div>
                <div className="col-md-6">
                  <FormGroup>
                    <label className="mb-1">End date</label>
                    <InputGroup className="input-group-alternative">
                      <Input
                        style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                        className="p-3"
                        placeholder="Project duration"
                        type="date"
                        name="endDate"
                        rows={5}
                        required
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>
          <FormGroup className="mt-4">
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
                placeholder="Select related fields"
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
          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Project cost (NGN)"
                    type="number"
                    name="cost"
                    rows={5}
                    required
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cost: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <Input
                    style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                    className="p-3"
                    placeholder="Amount raised (NGN)"
                    type="number"
                    name="raised"
                    rows={5}
                    required
                    value={formData.raised}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        raised: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </FormGroup>
            </div>
          </div>
          <FormGroup className="">
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Project manager's email"
                type="email"
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

          <div className="d-flex justify-content-between pt-4">
            <button
              onClick={handleExit}
              type="button"
              className="btn btn-outline-success px-5 py-3"
            >
              Exit
            </button>
            <Button
              onClick={handleNextStep}
              className="btn px-5 py-3"
              disabled={
                !formData.title ||
                !formData.description ||
                !formData.status ||
                !formData.duration ||
                !formData.endDate ||
                !formData.cost ||
                !formData.raised ||
                !formData.orgemail ||
                !formData.interest_area
              }
              style={{
                border: "none",
                background: "#02a95c",
              }}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    );
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
                  Add project
                </li>
              </ol>
            </nav>
            {renderCurrentStep()}
          </div>
          {renderProgress()}
        </div>
      </div>
    </div>
  );
};
export default CreateProject;

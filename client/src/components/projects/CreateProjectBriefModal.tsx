import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import useBackendService from "../../services/backend_service";
import { States } from "../../services/utils";
import "./datepicker-custom.css";

interface CreateProjectBriefModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSuccess?: () => void;
}

export const CreateProjectBriefModal: React.FC<
  CreateProjectBriefModalProps
> = ({ isOpen, toggle, onSuccess }) => {
  // const { currentState } = useContent();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    deadline: "",
    state: "",
    lga: "",
    isPublic: true,
    selectedNgos: [],
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [lgas, setLgas] = useState<string[]>([]);
  const [selectedLGA, setSelectedLGA] = useState<string | null>(null);
  const [areas, setAreas] = useState<Array<{ name: string }>>([]);
  const [ngos, setNgos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

  const { mutate: getAreas } = useBackendService("/areas", "GET", {
    onSuccess: (res2: unknown) => {
      setAreas(res2 as Array<{ name: string }>);
    },
    onError: () => {},
  });

  const { mutate: fetchNgos } = useBackendService(
    "/donor/users?all=true",
    "GET",
    {
      onSuccess: (res: { users: Array<{ id: string; name: string }> }) => {
        setNgos(res.users.map((ngo) => ({ value: ngo.id, label: ngo.name })));
      },
      onError: () => {
        toast.error("Failed to fetch NGOs.");
      },
    }
  );

  const { mutate: createProject } = useBackendService(
    "/auth/donor/projects",
    "POST",
    {
      onSuccess: () => {
        toast.success("Project created successfully!");
        resetForm();
        toggle();
        if (onSuccess) onSuccess();
        // Reload the window after a short delay to refresh data
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      onError: (error: unknown) => {
        let errorMessage = "Failed to create project";

        if (error && typeof error === "object") {
          const err = error as Record<string, unknown>;
          if (err.response && typeof err.response === "object") {
            const response = err.response as Record<string, unknown>;
            if (response.data && typeof response.data === "object") {
              const data = response.data as Record<string, unknown>;
              if (data.error && typeof data.error === "string") {
                errorMessage = data.error;
              }
            }
          }
          if (err.message && typeof err.message === "string") {
            errorMessage = err.message;
          }
        }
        console.log("❌ Create Project Error:", errorMessage);
        toast.error("Failed to create project");
        setIsLoading(false);
      },
    }
  );

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      budget: "",
      deadline: "",
      state: "",
      lga: "",
      isPublic: true,
      selectedNgos: [],
    });
    setSelectedState(null);
    setSelectedLGA(null);
    setDeadlineDate(null);
  };

  useEffect(() => {
    getAreas({});
    fetchNgos({ limit: 10000 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? value.replace(/\D/g, "") : value,
    }));
  };

  const handleStateChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSelectedState(selectedOption.value);
    setLgas(States.get(selectedOption.value) || []);
    setSelectedLGA(null);
    setFormData((prev) => ({
      ...prev,
      state: selectedOption.value,
      lga: "",
    }));
  };

  const handleLGAChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSelectedLGA(selectedOption.value);
    setFormData((prev) => ({
      ...prev,
      lga: selectedOption.value,
    }));
  };

  const handleCategoryChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      category: selectedOption?.value || "",
    }));
  };

  const handleDeadlineChange = (date: Date | null) => {
    setDeadlineDate(date);
    setFormData((prev) => ({
      ...prev,
      deadline: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const handleIsPublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isPublic = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      isPublic,
      selectedNgos: isPublic ? [] : prev.selectedNgos,
    }));
  };

  const handleNgoChange = (
    selectedOptions: Array<{ value: string; label: string }> | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      selectedNgos: selectedOptions || [],
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error("Please enter project title");
      return false;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter project description");
      return false;
    }
    if (!formData.budget || Number(formData.budget) <= 0) {
      toast.error("Please enter budget amount");
      return false;
    }
    if (!formData.deadline) {
      toast.error("Please select application deadline");
      return false;
    }
    if (!formData.state) {
      toast.error("Please select state");
      return false;
    }
    if (!formData.lga) {
      toast.error("Please select LGA");
      return false;
    }
    if (!formData.isPublic && formData.selectedNgos.length === 0) {
      toast.error("Please select at least one NGO for private project");
      return false;
    }
    return true;
  };

  const handleSaveAsDraft = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const projectData = {
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      budget: Number(formData.budget),
      deadline: formData.deadline,
      state: formData.state,
      lga: formData.lga,
      ispublic: formData.isPublic,
      organization_ids: formData.isPublic
        ? []
        : formData.selectedNgos.map((ngo) => ngo.value),
      status: "draft",
    };

    console.log("📤 Saving as Draft - Project Data:", projectData);
    createProject(projectData);
  };

  const handlePublish = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const status =
      !formData.isPublic && formData.selectedNgos.length > 0
        ? "active"
        : "brief";
    const projectData = {
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      budget: Number(formData.budget),
      deadline: formData.deadline,
      state: formData.state,
      lga: formData.lga,
      ispublic: formData.isPublic,
      organization_ids: formData.isPublic
        ? []
        : formData.selectedNgos.map((ngo) => ngo.value),
      status: status,
    };

    createProject(projectData);
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
    display: "block" as const,
  };

  const inputStyle = {
    backgroundColor: "#F2F2F2",
    height: "100%",
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      size="lg"
      className="create-brief-modal"
    >
      <ModalHeader
        toggle={toggle}
        style={{ borderBottom: "1px solid #e5e5e5" }}
      >
        <h5 style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>
          Create New Project Brief
        </h5>
      </ModalHeader>
      <ModalBody style={{ padding: "24px" }}>
        <Form>
          <FormGroup className="mb-4">
            <label style={labelStyle}>
              Project Title <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={inputStyle}
                className="p-3"
                placeholder="Enter project title"
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mb-4">
            <label style={labelStyle}>
              Category <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: "#F2F2F2",
                    minHeight: "55px",
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
                placeholder="Select category"
                required
                onChange={handleCategoryChange}
                options={areas.map((category) => ({
                  value: category.name,
                  label: category.name,
                }))}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mb-4">
            <label style={labelStyle}>
              Description <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={inputStyle}
                className="p-3"
                placeholder="Enter project brief description"
                type="textarea"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mb-4">
            <label style={labelStyle}>
              Budget <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={inputStyle}
                className="p-3"
                placeholder="Enter budget amount"
                type="number"
                name="budget"
                required
                value={formData.budget}
                onChange={handleInputChange}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mb-4">
            <label style={labelStyle}>
              Application Deadline <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup
              style={{ backgroundColor: "#F2F2F2", paddingBottom: "8px" }}
              className="input-group-alternative"
            >
              <DatePicker
                selected={deadlineDate}
                onChange={handleDeadlineChange}
                placeholderText="Select deadline"
                className="calendar-input p-2"
                calendarClassName="custom-calendar"
              />
            </InputGroup>
          </FormGroup>

          <div style={{ display: "flex", gap: "16px" }}>
            <FormGroup className="mb-4" style={{ flex: 1 }}>
              <label style={labelStyle}>
                State <span style={{ color: "red" }}>*</span>
              </label>
              <InputGroup className="input-group-alternative">
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "#F2F2F2",
                      minHeight: "55px",
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
                  placeholder="Select state"
                  required
                  onChange={handleStateChange}
                  options={Array.from(States.keys()).map((state) => ({
                    value: state,
                    label: state,
                  }))}
                  value={
                    selectedState
                      ? { value: selectedState, label: selectedState }
                      : null
                  }
                />
              </InputGroup>
            </FormGroup>

            <FormGroup className="mb-4" style={{ flex: 1 }}>
              <label style={labelStyle}>
                LGA <span style={{ color: "red" }}>*</span>
              </label>
              <InputGroup className="input-group-alternative">
                <Select
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "#F2F2F2",
                      minHeight: "55px",
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
                  placeholder="Select LGA"
                  required
                  onChange={handleLGAChange}
                  options={lgas.map((lga) => ({
                    value: lga,
                    label: lga,
                  }))}
                  value={
                    selectedLGA
                      ? { value: selectedLGA, label: selectedLGA }
                      : null
                  }
                  isDisabled={!selectedState}
                />
              </InputGroup>
            </FormGroup>
          </div>

          <FormGroup className="mb-4">
            <label style={labelStyle}>Project Visibility</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    minWidth: "60px",
                  }}
                >
                  Private
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleIsPublicChange({
                      target: { checked: !formData.isPublic },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  style={{
                    width: "56px",
                    height: "32px",
                    borderRadius: "16px",
                    border: "none",
                    backgroundColor: formData.isPublic ? "#28a745" : "#ccc",
                    cursor: "pointer",
                    position: "relative",
                    padding: 0,
                    transition: "background-color 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      top: "2px",
                      left: formData.isPublic ? "26px" : "2px",
                      transition: "left 0.3s ease",
                    }}
                  />
                </button>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    minWidth: "60px",
                  }}
                >
                  Public
                </span>
              </div>
            </div>
          </FormGroup>

          {!formData.isPublic && (
            <FormGroup className="mb-4">
              <label style={labelStyle}>
                Select NGOs <span style={{ color: "red" }}>*</span>
              </label>
              <InputGroup className="input-group-alternative">
                <Select
                  isMulti
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "#F2F2F2",
                      minHeight: "55px",
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
                  placeholder="Select one or more NGOs..."
                  required
                  onChange={handleNgoChange}
                  options={ngos}
                  value={formData.selectedNgos}
                  isClearable
                  isSearchable
                />
              </InputGroup>
            </FormGroup>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
            }}
          >
            <Button
              style={{
                backgroundColor: "#f3f4f6",
                color: "#1a1a1a",
                border: "none",
                borderRadius: "6px",
                padding: "14px 48px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                flex: 1,
              }}
              onClick={handleSaveAsDraft}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "14px 48px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                flex: 1,
              }}
              onClick={handlePublish}
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish Brief"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateProjectBriefModal;

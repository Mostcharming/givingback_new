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

interface EditProjectBriefModalProps {
  isOpen: boolean;
  toggle: () => void;
  project: Record<string, unknown>;
  onSuccess?: () => void;
}

export const EditProjectBriefModal: React.FC<EditProjectBriefModalProps> = ({
  isOpen,
  toggle,
  project,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: 0,
    deadline: "",
    state: "",
    lga: "",
  });

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [lgas, setLgas] = useState<string[]>([]);
  const [selectedLGA, setSelectedLGA] = useState<string | null>(null);
  const [areas, setAreas] = useState<Array<{ name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

  const { mutate: getAreas } = useBackendService("/areas", "GET", {
    onSuccess: (res2: unknown) => {
      setAreas(res2 as Array<{ name: string }>);
    },
    onError: () => {},
  });

  const { mutate: updateProject } = useBackendService(
    `/auth/donor/projects/${project?.id}`,
    "PUT",
    {
      onSuccess: () => {
        toast.success("Project updated successfully!");
        toggle();
        if (onSuccess) onSuccess();
        // Reload the window after a short delay to refresh data
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      onError: (error: unknown) => {
        let errorMessage = "Failed to update project";

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
        console.log("❌ Update Project Error:", errorMessage);
        toast.error("Failed to update project");
        setIsLoading(false);
      },
    }
  );

  // Initialize form with project data
  useEffect(() => {
    if (isOpen && project) {
      const proj = project as {
        id?: string;
        title?: string;
        category?: string;
        description?: string;
        cost?: number;
        endDate?: string;
        state?: string;
        capital?: string;
      };
      setFormData({
        title: proj.title || "",
        category: proj.category || "",
        description: proj.description || "",
        budget: proj.cost || 0,
        deadline: proj.endDate ? proj.endDate.split("T")[0] : "",
        state: proj.state || "",
        lga: proj.capital || "",
      });

      setSelectedState(proj.state || null);
      setSelectedLGA(proj.capital || null);

      if (proj.endDate) {
        setDeadlineDate(new Date(proj.endDate));
      }

      // Load LGAs for the selected state
      if (proj.state) {
        setLgas(States.get(proj.state) || []);
      }
    }
  }, [isOpen, project]);

  useEffect(() => {
    getAreas({});
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
      [name]: value,
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
    if (!formData.budget || formData.budget <= 0) {
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
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const projectData = {
      title: formData.title.trim(),
      category: formData.category,
      description: formData.description.trim(),
      budget: formData.budget,
      deadline: formData.deadline,
      state: formData.state,
      lga: formData.lga,
    };

    console.log("📤 Updating Project - Project Data:", projectData);
    updateProject(projectData);
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
      className="edit-brief-modal"
    >
      <ModalHeader
        toggle={toggle}
        style={{ borderBottom: "1px solid #e5e5e5" }}
      >
        <h5 style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>
          Edit Project Details
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
                value={
                  formData.category
                    ? { value: formData.category, label: formData.category }
                    : null
                }
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
              onClick={toggle}
              disabled={isLoading}
            >
              Cancel
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
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditProjectBriefModal;

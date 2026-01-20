import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
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
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
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

  const handleSaveAsDraft = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save as draft
      console.log("Saving as draft:", formData);
      toggle();
      setFormData({
        title: "",
        category: "",
        description: "",
        budget: "",
        deadline: "",
        state: "",
        lga: "",
      });
      setSelectedState(null);
      setSelectedLGA(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to publish
      console.log("Publishing:", formData);
      toggle();
      setFormData({
        title: "",
        category: "",
        description: "",
        budget: "",
        deadline: "",
        state: "",
        lga: "",
      });
      setSelectedState(null);
      setSelectedLGA(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error publishing:", error);
    } finally {
      setIsLoading(false);
    }
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
          {/* Project Title */}
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

          {/* Category */}
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

          {/* Description */}
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

          {/* Budget */}
          <FormGroup className="mb-4">
            <label style={labelStyle}>
              Budget <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={inputStyle}
                className="p-3"
                placeholder="Enter budget amount"
                type="text"
                name="budget"
                required
                value={formData.budget}
                onChange={handleInputChange}
              />
            </InputGroup>
          </FormGroup>

          {/* Application Deadline */}
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

          {/* Location - State and LGA */}
          <div style={{ display: "flex", gap: "16px" }}>
            {/* State */}
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

            {/* LGA */}
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

          {/* Buttons */}
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
              Save as Draft
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

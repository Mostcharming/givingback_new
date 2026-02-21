import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import "./datepicker-custom.css";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CreateMilestoneModalProps {
  isOpen: boolean;
  toggle: () => void;
  projectId: string | number;
  onSuccess?: (milestone: any) => void;
}

export const CreateMilestoneModal: React.FC<CreateMilestoneModalProps> = ({
  isOpen,
  toggle,
  projectId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    dueDate: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

  const { mutate: createMilestone } = useBackendService(
    `/auth/milestones`,
    "POST",
    {
      onSuccess: (data: any) => {
        toast.success("Milestone created successfully!");
        resetForm();
        toggle();
        if (onSuccess) onSuccess(data.data);
        setIsLoading(false);
      },
      onError: (error: unknown) => {
        let errorMessage = "Failed to create milestone";

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
        console.log("❌ Create Milestone Error:", errorMessage);
        toast.error("Failed to create milestone");
        setIsLoading(false);
      },
    }
  );

  const resetForm = () => {
    setFormData({
      title: "",
      target: "",
      dueDate: "",
      description: "",
    });
    setDeadlineDate(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "target" ? (value ? parseInt(value, 10) : "") : value,
    }));
  };

  const handleDueDateChange = (date: Date | null) => {
    setDeadlineDate(date);
    setFormData((prev) => ({
      ...prev,
      dueDate: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error("Please enter milestone title");
      return false;
    }
    if (
      !formData.target ||
      parseInt(formData.target as unknown as string, 10) <= 0
    ) {
      toast.error("Please enter a valid target");
      return false;
    }
    if (!formData.dueDate) {
      toast.error("Please select a due date");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter milestone description");
      return false;
    }
    return true;
  };

  const handleCreate = () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const milestoneData = {
      title: formData.title.trim(),
      target: parseInt(formData.target as unknown as string, 10),
      due_date: formData.dueDate,
      description: formData.description.trim(),
      project_id: projectId,
    };

    createMilestone(milestoneData);
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
      className="create-milestone-modal"
    >
      <ModalHeader
        toggle={toggle}
        style={{ borderBottom: "1px solid #e5e5e5" }}
      >
        <h5 style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>
          Create New Milestone
        </h5>
      </ModalHeader>
      <ModalBody style={{ padding: "24px" }}>
        <Form>
          <FormGroup className="mb-4">
            <label style={labelStyle}>
              Milestone Title <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={inputStyle}
                className="p-3"
                placeholder="Enter milestone title"
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
              Target <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={inputStyle}
                className="p-3"
                placeholder="Enter target (number)"
                type="number"
                name="target"
                required
                value={formData.target}
                onChange={handleInputChange}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mb-4">
            <label style={labelStyle}>
              Due Date <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup
              style={{ backgroundColor: "#F2F2F2", paddingBottom: "8px" }}
              className="input-group-alternative"
            >
              <DatePicker
                selected={deadlineDate}
                onChange={handleDueDateChange}
                placeholderText="Select due date"
                className="calendar-input p-2"
                calendarClassName="custom-calendar"
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
                placeholder="Enter milestone description"
                type="textarea"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </InputGroup>
          </FormGroup>

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
              onClick={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Milestone"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default CreateMilestoneModal;

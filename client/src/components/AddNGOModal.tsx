/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookOpen, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import useBackendService from "../services/backend_service";
import "./add-ngo-modal.css";
import FileUpload from "./file_upload";

interface AddNGOModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSuccess?: () => void;
}

export default function AddNGOModal({
  isOpen,
  toggle,
  onSuccess,
}: AddNGOModalProps) {
  const [activeTab, setActiveTab] = useState("manual");
  const [uploadFile, setUploadFile] = useState<File | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    country: "Nigeria",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: uploadNGO } = useBackendService(
    "/auth/organizations",
    "POST",
    {
      onSuccess: (res: any) => {
        setIsLoading(false);
        toast.success("NGO added successfully");
        resetForm();
        toggle();
        onSuccess?.();
      },
      onError: (error: any) => {
        setIsLoading(false);
        toast.error(error.message || "Failed to add NGO");
      },
    }
  );

  const { mutate: bulkUploadNGO } = useBackendService("/admin/bulk", "POST", {
    onSuccess: (res: any) => {
      setIsLoading(false);
      toast.success("NGO uploaded successfully");
      resetForm();
      toggle();
      onSuccess?.();
    },
    onError: (error: any) => {
      setIsLoading(false);
      toast.error(error.message || "Failed to upload NGO");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      state: "",
      country: "Nigeria",
      description: "",
    });
    setUploadFile(undefined);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (file: File) => {
    setUploadFile(file);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    uploadNGO(formData);
  };

  const handleFileUpload = async () => {
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const extension = uploadFile.name.split(".").pop();
    if (extension !== "xlsx" && extension !== "xls") {
      toast.error("Please upload an Excel file");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("bulk", uploadFile);

    setIsLoading(true);
    bulkUploadNGO(formDataToSend);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" className="add-ngo-modal">
      <ModalHeader
        toggle={toggle}
        className="add-ngo-modal-header"
        style={{
          borderBottom: "1px solid #e5e7eb",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: 0, fontWeight: 700, color: "#1a1a1a" }}>
          Add New NGO
        </h4>
        {/* <button
          onClick={toggle}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={20} color="#666666" />
        </button> */}
      </ModalHeader>

      {/* Tab Navigation */}
      <div className="tab-container" style={{ margin: "0", marginBottom: "0" }}>
        <div className="tab-wrapper">
          <button
            className={`tab-button ${
              activeTab === "manual" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("manual")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FileText size={18} />
            Manual entry
          </button>
          <button
            className={`tab-button ${
              activeTab === "upload" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("upload")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Upload size={18} />
            Upload details
          </button>
        </div>
      </div>

      <ModalBody style={{ padding: "24px" }}>
        {/* Manual Entry Tab */}
        {activeTab === "manual" && (
          <Form onSubmit={handleManualSubmit}>
            <FormGroup>
              <Label
                for="name"
                style={{ fontWeight: 600, marginBottom: "8px" }}
              >
                NGO Name *
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter NGO name"
                style={{
                  borderRadius: "6px",
                  borderColor: "#d1d5db",
                  fontSize: "14px",
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label
                for="email"
                style={{ fontWeight: 600, marginBottom: "8px" }}
              >
                Email *
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                style={{
                  borderRadius: "6px",
                  borderColor: "#d1d5db",
                  fontSize: "14px",
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label
                for="phone"
                style={{ fontWeight: 600, marginBottom: "8px" }}
              >
                Phone
              </Label>
              <Input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                style={{
                  borderRadius: "6px",
                  borderColor: "#d1d5db",
                  fontSize: "14px",
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label
                for="address"
                style={{ fontWeight: 600, marginBottom: "8px" }}
              >
                Address
              </Label>
              <Input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address"
                style={{
                  borderRadius: "6px",
                  borderColor: "#d1d5db",
                  fontSize: "14px",
                }}
              />
            </FormGroup>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <FormGroup>
                <Label
                  for="state"
                  style={{ fontWeight: 600, marginBottom: "8px" }}
                >
                  State
                </Label>
                <Input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  style={{
                    borderRadius: "6px",
                    borderColor: "#d1d5db",
                    fontSize: "14px",
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label
                  for="country"
                  style={{ fontWeight: 600, marginBottom: "8px" }}
                >
                  Country
                </Label>
                <Input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                  style={{
                    borderRadius: "6px",
                    borderColor: "#d1d5db",
                    fontSize: "14px",
                  }}
                />
              </FormGroup>
            </div>

            <FormGroup>
              <Label
                for="description"
                style={{ fontWeight: 600, marginBottom: "8px" }}
              >
                Description
              </Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange as any}
                placeholder="Enter NGO description"
                style={{
                  borderRadius: "6px",
                  borderColor: "#d1d5db",
                  fontSize: "14px",
                }}
                rows={4}
              />
            </FormGroup>
          </Form>
        )}

        {/* Upload Details Tab */}
        {activeTab === "upload" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  marginBottom: "16px",
                }}
              >
                Upload an Excel file with NGO details. Download the template to
                see the required format.
              </p>
              <Button
                color="link"
                style={{
                  padding: 0,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#128330",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <BookOpen size={16} />
                Download template
              </Button>
            </div>

            <FileUpload
              file={uploadFile}
              width="100%"
              height="200px"
              onFile={handleFileSelect}
              backgroundColor="#f9fafb"
            >
              {[
                <div key="upload-container" style={{ textAlign: "center" }}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#666666"
                    strokeWidth="2"
                    style={{ marginBottom: "12px" }}
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1a1a1a",
                      display: "block",
                      marginBottom: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Click to upload or drag and drop
                  </label>
                  <p style={{ fontSize: "12px", color: "#666666", margin: 0 }}>
                    {uploadFile ? uploadFile.name : "Excel (.xlsx, .xls)"}
                  </p>
                </div>,
              ]}
            </FileUpload>
          </div>
        )}
      </ModalBody>

      <ModalFooter
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
        }}
      >
        <Button
          color="secondary"
          onClick={toggle}
          style={{
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            padding: "10px 24px",
            backgroundColor: "#f3f4f6",
            color: "#1a1a1a",
            border: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          color="success"
          onClick={
            activeTab === "manual" ? handleManualSubmit : handleFileUpload
          }
          disabled={isLoading}
          style={{
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 600,
            padding: "10px 24px",
            backgroundColor: "#28a745",
            border: "none",
          }}
        >
          {isLoading ? "Adding..." : "Add NGO"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

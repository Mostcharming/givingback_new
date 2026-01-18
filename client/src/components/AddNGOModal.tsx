/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import useBackendService from "../services/backend_service";
import "./add-ngo-modal.css";
import ManualEntryForm from "./ManualEntry/ManualEntryForm";
import UploadFileForm from "./UploadFile/UploadFileForm";

interface AddNGOModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSuccess?: () => void;
  areas?: Array<{ name: string }>;
}

export default function AddNGOModal({
  isOpen,
  toggle,
  onSuccess,
  areas = [],
}: AddNGOModalProps) {
  const [activeTab, setActiveTab] = useState("manual");
  const [uploadFile, setUploadFile] = useState<File | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    country: "Nigeria",
    description: "",
    registrationNumber: "",
    interestArea: [],
    contactPerson: "",
    contactTitle: "",
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
      registrationNumber: "",
      interestArea: [],
      contactPerson: "",
      contactTitle: "",
    });
    setUploadFile(undefined);
    setCurrentStep(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThematicAreaChange = (selectedOptions: any) => {
    setFormData((prev) => ({
      ...prev,
      interestArea: selectedOptions
        ? selectedOptions.map((option: any) => option.value)
        : [],
    }));
  };

  const handleFileSelect = (file: File) => {
    setUploadFile(file);
  };

  const validateStep1 = (): boolean => {
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Please enter organization name");
      return false;
    }
    if (
      !formData.registrationNumber ||
      formData.registrationNumber.trim() === ""
    ) {
      toast.error("Please enter registration number");
      return false;
    }
    if (
      !formData.interestArea ||
      (Array.isArray(formData.interestArea) &&
        formData.interestArea.length === 0)
    ) {
      toast.error("Please select at least one focus area");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!formData.contactPerson || formData.contactPerson.trim() === "") {
      toast.error("Please enter contact person's name");
      return false;
    }
    if (!formData.contactTitle || formData.contactTitle.trim() === "") {
      toast.error("Please enter contact person's title/position");
      return false;
    }
    if (!formData.email || formData.email.trim() === "") {
      toast.error("Please enter email address");
      return false;
    }
    if (!formData.phone || formData.phone.trim() === "") {
      toast.error("Please enter phone number");
      return false;
    }
    return true;
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
      </ModalHeader>

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
        {activeTab === "manual" && (
          <ManualEntryForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleManualSubmit}
            currentStep={currentStep}
            uploadFile={uploadFile}
            onFile={handleFileSelect}
            areas={areas}
            onThematicAreaChange={handleThematicAreaChange}
          />
        )}

        {activeTab === "upload" && (
          <UploadFileForm uploadFile={uploadFile} onFile={handleFileSelect} />
        )}
      </ModalBody>

      <ModalFooter
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        {activeTab === "manual" ? (
          <>
            <Button
              color="secondary"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              style={{
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                padding: "14px 48px",
                backgroundColor: currentStep === 1 ? "#e5e7eb" : "#f3f4f6",
                color: currentStep === 1 ? "#9ca3af" : "#1a1a1a",
                border: "none",
                flex: 1,
                cursor: currentStep === 1 ? "not-allowed" : "pointer",
              }}
            >
              Previous
            </Button>

            <Button
              color="success"
              onClick={() => {
                if (currentStep === 1) {
                  if (validateStep1()) {
                    setCurrentStep(currentStep + 1);
                  }
                } else if (currentStep === 2) {
                  if (validateStep2()) {
                    setCurrentStep(currentStep + 1);
                  }
                } else if (currentStep === 4) {
                  handleManualSubmit(new Event("submit") as any);
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={isLoading}
              style={{
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                padding: "14px 48px",
                backgroundColor: isLoading ? "#9ca3af" : "#28a745",
                border: "none",
                flex: 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Adding..." : currentStep === 4 ? "Submit" : "Next"}
            </Button>
          </>
        ) : (
          <>
            <Button
              color="secondary"
              onClick={toggle}
              style={{
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                padding: "14px 48px",
                backgroundColor: "#f3f4f6",
                color: "#1a1a1a",
                border: "none",
                flex: 1,
              }}
            >
              Cancel
            </Button>
            <Button
              color="success"
              onClick={handleFileUpload}
              disabled={isLoading}
              style={{
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: 600,
                padding: "14px 48px",
                backgroundColor: "#28a745",
                border: "none",
                flex: 1,
              }}
            >
              {isLoading ? "Adding..." : "Add NGO"}
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

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
          <ManualEntryForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleManualSubmit}
          />
        )}

        {/* Upload Details Tab */}
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
          onClick={
            activeTab === "manual" ? handleManualSubmit : handleFileUpload
          }
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
      </ModalFooter>
    </Modal>
  );
}

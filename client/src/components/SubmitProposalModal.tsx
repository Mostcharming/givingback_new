import { Plus, Upload, X } from "lucide-react";
import { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import "./submit-proposal-modal.css";

interface SubmitProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefTitle?: string;
}

export default function SubmitProposalModal({
  isOpen,
  onClose,
}: SubmitProposalModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [supportingDocument, setSupportingDocument] = useState<File | null>(
    null
  );
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSupportingDocument(e.target.files[0]);
    }
  };

  const handleRemoveDocument = () => {
    setSupportingDocument(null);
  };

  const handleAddDeliverable = () => {
    if (newDeliverable.trim()) {
      setDeliverables([...deliverables, newDeliverable.trim()]);
      setNewDeliverable("");
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!coverLetter.trim()) {
      alert("Please write a cover letter");
      return;
    }
    // Handle submission logic here
    console.log("Submitting proposal", {
      coverLetter,
      supportingDocument,
      deliverables,
    });
    setCoverLetter("");
    setSupportingDocument(null);
    setDeliverables([]);
    setNewDeliverable("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      size="lg"
      className="submit-proposal-modal"
    >
      <ModalHeader
        toggle={onClose}
        className="submit-proposal-modal-header"
        style={{
          borderBottom: "1px solid #DDD",
          padding: "30px 50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "150%",
              color: "#1E1E1E",
              margin: 0,
            }}
          >
            Submit proposal
          </h2>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "150%",
              color: "#666",
              marginTop: "4px",
              marginBottom: 0,
            }}
          >
            Provide your details that would make you stand out
          </p>
        </div>
      </ModalHeader>

      <ModalBody
        style={{
          padding: "27px 50px 30px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Cover Letter Textarea */}
        <div>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write cover letter"
            style={{
              width: "100%",
              height: "150px",
              borderRadius: "10px",
              padding: "16px",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "150%",
              resize: "none",
              outline: "none",
              border: "none",
              background: "#F6F6F6",
              color: "#222",
              fontFamily: "Archivo, sans-serif",
            }}
          />
        </div>

        {/* Deliverables Section */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "150%",
                color: "#1E1E1E",
                margin: 0,
              }}
            >
              Deliverables
            </p>
          </div>

          {/* Deliverables List */}
          {deliverables.length > 0 && (
            <div
              style={{
                marginBottom: "12px",
                padding: "12px",
                backgroundColor: "#F9F9F9",
                borderRadius: "8px",
                border: "1px solid #E0E0E0",
              }}
            >
              {deliverables.map((deliverable, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom:
                      index < deliverables.length - 1
                        ? "1px solid #EEE"
                        : "none",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#444" }}>
                    {deliverable}
                  </span>
                  <button
                    onClick={() => handleRemoveDeliverable(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                      padding: "4px 8px",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Deliverable Input */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <input
              type="text"
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddDeliverable();
                }
              }}
              placeholder="Enter deliverable"
              style={{
                flex: 1,
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "150%",
                border: "1px solid #DDD",
                outline: "none",
                background: "#FFF",
                color: "#222",
                fontFamily: "Archivo, sans-serif",
              }}
            />
            <button
              onClick={handleAddDeliverable}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "none",
                background: "#016741",
                color: "#FFF",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#014d33";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#016741";
              }}
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        {/* Portfolio Section */}
        <div>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "150%",
              color: "#444",
              marginBottom: "12px",
            }}
          >
            Attach supporting documents to strengthen your application. This
            could include your portfolio, resume, case studies, certifications,
            or any other relevant documents that demonstrate your qualifications
            and experience. You can upload one file (PDF, Word, or Image
            format).
          </p>

          {/* Supporting Document Display */}
          {supportingDocument && (
            <div
              style={{
                marginBottom: "16px",
                padding: "16px",
                backgroundColor: "#F9F9F9",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #E0E0E0",
              }}
            >
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#1E1E1E",
                    margin: 0,
                    marginBottom: "4px",
                  }}
                >
                  File picked:
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    margin: 0,
                    wordBreak: "break-word",
                  }}
                >
                  {supportingDocument.name}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                <button
                  onClick={handleRemoveDocument}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#999",
                    cursor: "pointer",
                    padding: "4px 8px",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              width: "100%",
              borderRadius: "8px",
              padding: "24px",
              border: supportingDocument
                ? "1px solid #E0E0E0"
                : "1px dashed #666",
              background: supportingDocument ? "#F9F9F9" : "#FFF",
              cursor: supportingDocument ? "pointer" : "pointer",
              opacity: 1,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f9f9f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = supportingDocument
                ? "#F9F9F9"
                : "#FFF";
            }}
          >
            <input
              type="file"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Upload size={20} style={{ color: "#016741" }} />
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 500,
                lineHeight: "150%",
                color: "#1E1E1E",
              }}
            >
              {supportingDocument ? "Change document" : "Upload document"}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "140%",
                color: "#999",
              }}
            >
              {supportingDocument
                ? "Click to replace file"
                : "Select a file to upload"}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          color="success"
          size="lg"
          block
          onClick={handleSubmit}
          style={{
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 500,
            padding: "21px",
            background: "#016741",
            border: "none",
            marginTop: "8px",
          }}
        >
          Submit proposal
        </Button>
      </ModalBody>
    </Modal>
  );
}

import { Upload, X } from "lucide-react";
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
  const [portfolioProjects, setPortfolioProjects] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (portfolioProjects.length + newFiles.length <= 3) {
        setPortfolioProjects([...portfolioProjects, ...newFiles]);
      } else {
        alert("You can only add up to 3 projects");
      }
    }
  };

  const handleRemoveProject = (index: number) => {
    setPortfolioProjects(portfolioProjects.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!coverLetter.trim()) {
      alert("Please write a cover letter");
      return;
    }
    // Handle submission logic here
    console.log("Submitting proposal", {
      coverLetter,
      portfolioProjects,
    });
    setCoverLetter("");
    setPortfolioProjects([]);
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
              height: "250px",
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
            Highlight the most relevant projects from your profile to
            demonstrate your experience and skills. You can add up to three
            projects total.
          </p>

          {/* Portfolio Projects List */}
          {portfolioProjects.length > 0 && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#F9F9F9",
                borderRadius: "8px",
              }}
            >
              {portfolioProjects.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom:
                      index < portfolioProjects.length - 1
                        ? "1px solid #EEE"
                        : "none",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#444" }}>
                    {file.name}
                  </span>
                  <button
                    onClick={() => handleRemoveProject(index)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#999",
                      cursor: "pointer",
                      padding: "4px 8px",
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
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
              border: "1px dashed #666",
              background: "#FFF",
              cursor: portfolioProjects.length < 3 ? "pointer" : "not-allowed",
              opacity: portfolioProjects.length < 3 ? 1 : 0.6,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (portfolioProjects.length < 3) {
                e.currentTarget.style.backgroundColor = "#f9f9f9";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFF";
            }}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              disabled={portfolioProjects.length >= 3}
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
              Add a portfolio project
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "140%",
                color: "#999",
              }}
            >
              {portfolioProjects.length}/3 projects added
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

import { AlertCircle, BookOpen } from "lucide-react";
import { Button } from "reactstrap";
import FileUpload from "../file_upload";

interface UploadFileFormProps {
  uploadFile: File | undefined;
  onFile: (file: File) => void;
}

export default function UploadFileForm({
  uploadFile,
  onFile,
}: UploadFileFormProps) {
  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <p
          style={{
            fontSize: "14px",
            color: "#666666",
            marginBottom: "16px",
          }}
        >
          Upload File
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
        onFile={onFile}
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
              <span style={{ color: "#128330" }}>Click to upload</span> or drag
              and drop
            </label>
            <p style={{ fontSize: "12px", color: "#666666", margin: 0 }}>
              {uploadFile ? uploadFile.name : "Excel (.xlsx, .xls)"}
            </p>
          </div>,
        ]}
      </FileUpload>

      <div
        style={{
          marginTop: "20px",
          backgroundColor: "rgba(18, 131, 48, 0.21)",
          border: "1px solid rgba(18, 131, 48, 0.62)",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <AlertCircle size={20} color="#128330" strokeWidth={2.5} />
          <h3
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: 600,
              color: "#128330",
            }}
          >
            File Requirements
          </h3>
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: "24px",
            listStyle: "none",
            fontSize: "13px",
            color: "#128330",
            lineHeight: "1.6",
          }}
        >
          <li style={{ position: "relative", paddingLeft: "8px" }}>
            <span style={{ position: "absolute", left: "-16px" }}>•</span>
            Support formats: Excel (.xlsx, .xls) or CSV
          </li>
          <li style={{ position: "relative", paddingLeft: "8px" }}>
            <span style={{ position: "absolute", left: "-16px" }}>•</span>
            Maximum file size: 10MB
          </li>
          <li style={{ position: "relative", paddingLeft: "8px" }}>
            <span style={{ position: "absolute", left: "-16px" }}>•</span>
            Required columns: Name, Email, Phone Number
          </li>
          <li style={{ position: "relative", paddingLeft: "8px" }}>
            <span style={{ position: "absolute", left: "-16px" }}>•</span>
            Download Template for the corrcect format
          </li>
        </ul>
      </div>
    </div>
  );
}

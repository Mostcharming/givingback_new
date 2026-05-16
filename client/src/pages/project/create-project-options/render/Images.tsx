import { Upload } from "lucide-react";
import { useRef } from "react";
import { Button, FormGroup } from "reactstrap";

const Images = ({
  formData,
  setFormData,
  handleNextStep,
  handleBackStep,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file as Blob),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...newFiles],
    }));
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {/* Preview Grid */}

      {/* Upload Section */}
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-2" style={{ color: "black" }}>
          Project media
        </h2>
        <p className="text-muted mb-0">
          Upload images/videos from this project
        </p>
      </div>
      {formData.images?.length > 0 && (
        <div
          className="mb-4"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          {formData.images.map((imgObj, idx) => (
            <div
              key={idx}
              style={{
                width: "100%",
                paddingTop: "100%",
                position: "relative",
                overflow: "hidden",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#f5f5f5",
              }}
            >
              <img
                src={imgObj.preview}
                alt={`preview-${idx}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
      )}

      <form className="pr-5" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <FormGroup className="mb-3">
            <div
              style={{
                border: "2px dotted #ccc",
                borderRadius: "8px",
                padding: "40px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#F9F9F9",
                position: "relative",
              }}
              onClick={handleFileClick}
            >
              <div style={{ color: "#28a745" }}>
                <Upload />
              </div>

              <p style={{ marginTop: "10px", color: "#555" }}>
                Tap to upload your files here
              </p>
              <p
                style={{
                  textDecoration: "underline",
                  marginTop: "10px",
                  color: "#28a745",
                }}
              >
                Browse
              </p>

              <input
                id="fileInput"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </FormGroup>
        </div>

        <div className="d-flex justify-content-between pt-4">
          <button
            onClick={handleBackStep}
            type="button"
            className="btn btn-outline-success px-5 py-3"
          >
            Go Back
          </button>
          <Button
            onClick={handleNextStep}
            className="btn px-5 py-3"
            style={{ border: "none", background: "#02a95c" }}
          >
            {isLoading ? "Loading...." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Images;

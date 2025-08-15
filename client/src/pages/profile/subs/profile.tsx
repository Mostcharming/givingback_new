import { User } from "lucide-react";
import { useState } from "react";

const ProfileData = () => {
  const [formData, setFormData] = useState({
    orgName: "",
    orgEmail: "",
    country: "",
    state: "",
    cac: null,
    phone_number: "",
    email: "",
    bio: "",
    website: "",
    socialLinks: [{ platform: "", url: "" }],
    profile_photo: null,
  });
  const fileInputRef = useRef(null);
  const handleFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      profile_photo: file,
    }));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="">
      <div className="mb-4">
        <h2 style={{ color: "black" }} className="h4 fw-bold mb-2">
          Project sponsor
        </h2>
        <p className="text-muted mb-0">
          Add details about your project sponsors here
        </p>
      </div>

      <form className="pr-5">
        <div className="mb-5 relative">
          <label className="form-label fw-medium">{"Sponsor's logo"}</label>
          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              className="border rounded-lg d-flex align-items-center justify-content-center bg-light overflow-hidden"
              style={{ width: "80px", height: "80px" }}
            >
              {s.logoFile ? (
                <img
                  src={URL.createObjectURL(s.logoFile)}
                  alt="Sponsor Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <User size={32} className="text-success" />
              )}
            </div>
            <button
              type="button"
              className="ml-4 btn btn-outline-secondary"
              onClick={() => fileInputs.current[index].click()}
            >
              Upload
            </button>
            <input
              type="file"
              accept="image/*"
              ref={(el) => (fileInputs.current[index] = el)}
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileData;

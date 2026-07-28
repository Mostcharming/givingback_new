import { Plus, Trash2, User } from "lucide-react";
import { useRef } from "react";
import { Button, FormGroup, Input, InputGroup } from "reactstrap";

const Sponsor = ({ formData, setFormData, handleNextStep, handleBackStep }) => {
  const handleSponsorChange = (index, key, value) => {
    const updatedSponsors = [...formData.sponsors];
    updatedSponsors[index][key] = value;
    setFormData((prev) => ({
      ...prev,
      sponsors: updatedSponsors,
    }));
  };

  const handleFileChange = (index, file) => {
    const updatedSponsors = [...formData.sponsors];
    updatedSponsors[index].logoFile = file;
    setFormData((prev) => ({
      ...prev,
      sponsors: updatedSponsors,
    }));
  };

  const handleAddSponsor = () => {
    setFormData((prev: any) => ({
      ...prev,
      sponsors: [
        ...prev.sponsors,
        {
          sponsor: "",
          logoFile: null,
          sdesc: "",
        },
      ],
    }));
  };

  const fileInputs = useRef([]);

  const handleRemove = (index) => {
    const updated = [...formData.sponsors];
    updated.splice(index, 1);
    setFormData({ ...formData, sponsors: updated });
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
        {formData.sponsors.map((s, index) => (
          <div className="mb-5 relative" key={index}>
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

            <FormGroup>
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Sponsor's name"
                  type="text"
                  required
                  value={s.sponsor}
                  onChange={(e) =>
                    handleSponsorChange(index, "sponsor", e.target.value)
                  }
                />
              </InputGroup>
            </FormGroup>

            <FormGroup className="mt-3">
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Write a short description about what they do"
                  type="textarea"
                  rows={5}
                  required
                  value={s.sdesc}
                  onChange={(e) =>
                    handleSponsorChange(index, "sdesc", e.target.value)
                  }
                />
              </InputGroup>
            </FormGroup>
            {formData.sponsors.length > 1 && (
              <div
                className="text-danger mt-2 "
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  right: "70px",
                }}
                onClick={() => handleRemove(index)}
              >
                <Trash2 />
              </div>
            )}
          </div>
        ))}

        <div
          className="d-flex align-items-center text-success mt-2"
          style={{ cursor: "pointer" }}
          onClick={handleAddSponsor}
        >
          <Plus /> <span className="ms-2">Add another sponsor</span>
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
            disabled={formData.sponsors.some((m) => !m.sponsor || !m.sdesc)}
            style={{
              border: "none",
              background: "#02a95c",
            }}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Sponsor;

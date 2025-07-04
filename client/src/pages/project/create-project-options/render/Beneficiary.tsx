import { Plus, Trash2 } from "lucide-react";
import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

const Beneficiary = ({
  formData,
  setFormData,
  handleNextStep,
  handleBackStep,
}) => {
  const handleChange = (index, field, value) => {
    const updatedbeneficiaries = [...formData.beneficiaries];
    updatedbeneficiaries[index][field] = value;
    setFormData({ ...formData, beneficiaries: updatedbeneficiaries });
  };

  const handleAddMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      beneficiaries: [
        ...prev.beneficiaries,
        {
          name: "",
          contact: "",
          address: "",
        },
      ],
    }));
  };

  const handleRemoveMilestone = (index) => {
    const updated = [...formData.beneficiaries];
    updated.splice(index, 1);
    setFormData({ ...formData, beneficiaries: updated });
  };

  return (
    <div className="">
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-2" style={{ color: "black" }}>
          Project beneficiaries
        </h2>
        <p className="text-muted mb-0">
          Add details about those that benefited from the project
        </p>
      </div>

      <form className="pr-5">
        {formData.beneficiaries.map((item, index) => (
          <div key={index} className="mb-4">
            <h3 className="h6 mb-2" style={{ color: "black" }}>
              Beneficiary -0{index + 1}
            </h3>

            <div className="row mt-3">
              <div className="col-md-6">
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <Input
                      style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                      className="p-3"
                      placeholder="Beneficiary's name"
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </div>

              <div className="col-md-6">
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText
                        style={{
                          backgroundColor: "#F2F2F2",
                          height: "100%",
                        }}
                      >
                        +234 |
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                      className="p-3"
                      placeholder="Contact Details"
                      type="text"
                      value={item.contact}
                      onChange={(e) =>
                        handleChange(index, "contact", e.target.value)
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Address"
                  type="text"
                  value={item.address}
                  onChange={(e) =>
                    handleChange(index, "address", e.target.value)
                  }
                />
              </InputGroup>
            </FormGroup>

            {formData.beneficiaries.length > 1 && (
              <div
                className="text-danger mt-2"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => handleRemoveMilestone(index)}
              >
                <Trash2 />
              </div>
            )}
          </div>
        ))}

        <div
          className="d-flex align-items-center text-success mt-2"
          style={{ cursor: "pointer" }}
          onClick={handleAddMilestone}
        >
          <Plus /> <span className="ms-2">Add another beneficiary</span>
        </div>

        <div className="d-flex justify-content-between pt-4">
          <button
            onClick={handleBackStep}
            type="button"
            className="btn btn-outline-success px-5 py-3"
          >
            Back
          </button>
          <Button
            onClick={handleNextStep}
            className="btn px-5 py-3"
            disabled={formData.beneficiaries.some(
              (m) => !m.name || !m.contact || !m.address
            )}
            style={{ border: "none", background: "#02a95c" }}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Beneficiary;

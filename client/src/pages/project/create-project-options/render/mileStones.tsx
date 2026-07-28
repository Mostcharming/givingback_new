import { Plus, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, FormGroup, Input, InputGroup } from "reactstrap";
import "./datepicker-custom.css";
const MilestoneForm = ({
  formData,
  setFormData,
  handleNextStep,
  handleBackStep,
}) => {
  const handleChange = (index, field, value) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index][field] = value;
    setFormData({ ...formData, milestones: updatedMilestones });
  };

  const handleAddMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        {
          milestone: "",
          miledes: "",
          mstartDate: "",
          mendDate: "",
          mstatus: "",
        },
      ],
    }));
  };

  const handleRemoveMilestone = (index) => {
    const updated = [...formData.milestones];
    updated.splice(index, 1);
    setFormData({ ...formData, milestones: updated });
  };

  return (
    <div className="">
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-2" style={{ color: "black" }}>
          Timeline & Milestone
        </h2>
        <p className="text-muted mb-0">
          Add details about completing the project
        </p>
      </div>

      <form className="pr-5">
        {formData.milestones.map((item, index) => (
          <div key={index} className="mb-4">
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Milestone title"
                  type="text"
                  value={item.milestone}
                  onChange={(e) =>
                    handleChange(index, "milestone", e.target.value)
                  }
                />
              </InputGroup>
            </FormGroup>

            <FormGroup className="mt-3">
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Milestone description"
                  type="textarea"
                  rows={3}
                  value={item.miledes}
                  onChange={(e) =>
                    handleChange(index, "miledes", e.target.value)
                  }
                />
              </InputGroup>
            </FormGroup>

            <div className="row mt-3">
              <div className="col-md-6">
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <select
                      style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                      className="form-control p-3"
                      name="status"
                      value={item.mstatus}
                      onChange={(e) =>
                        handleChange(index, "mstatus", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Status
                      </option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </InputGroup>
                </FormGroup>
              </div>

              <div className="col-md-6">
                <div className="row">
                  <InputGroup
                    style={{ backgroundColor: "#F2F2F2", paddingBottom: "8px" }}
                    className="input-group-alternative"
                  >
                    <DatePicker
                      selectsRange
                      startDate={
                        item.mstartDate ? new Date(item.mstartDate) : null
                      }
                      endDate={item.mendDate ? new Date(item.mendDate) : null}
                      onChange={([start, end]) => {
                        handleChange(
                          index,
                          "mstartDate",
                          start ? start.toISOString().split("T")[0] : ""
                        );
                        handleChange(
                          index,
                          "mendDate",
                          end ? end.toISOString().split("T")[0] : ""
                        );
                      }}
                      placeholderText="Duration"
                      className="calendar-input p-2"
                      calendarClassName="custom-calendar"
                    />
                  </InputGroup>
                </div>
              </div>
            </div>

            {formData.milestones.length > 1 && (
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
          <Plus /> <span className="ms-2">Add another milestone</span>
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
            disabled={formData.milestones.some(
              (m) =>
                !m.milestone ||
                !m.miledes ||
                !m.mstartDate ||
                !m.mendDate ||
                !m.mstatus
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

export default MilestoneForm;

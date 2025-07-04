import Select from "react-select";
import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

const Details = ({
  formData,
  setFormData,
  handleExit,
  handleNextStep,
  onThematicAreaChange,
  areas,
}) => {
  return (
    <div className="">
      <div className="mb-4">
        <h2 style={{ color: "black" }} className="h4 fw-bold mb-2">
          Project details
        </h2>
        <p className="text-muted mb-0">Add details about your project here</p>
      </div>

      <form className="pr-5">
        <FormGroup className="">
          <InputGroup className="input-group-alternative">
            <Input
              style={{ backgroundColor: "#F2F2F2", height: "100%" }}
              className="p-3"
              placeholder="Project title"
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </InputGroup>
        </FormGroup>
        <FormGroup className="mt-4">
          <InputGroup className="input-group-alternative">
            <Input
              style={{ backgroundColor: "#F2F2F2", height: "100%" }}
              className="p-3"
              placeholder="Project description"
              type="textarea"
              name="description"
              rows={5}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </InputGroup>
        </FormGroup>
        <div className="row mt-4">
          <div className="col-md-6">
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <select
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="form-control p-3"
                  name="status"
                  required
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="" disabled>
                    Project Status
                  </option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </InputGroup>
            </FormGroup>
          </div>

          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <FormGroup>
                  <label className="">Start date</label>

                  <InputGroup className="input-group-alternative">
                    <Input
                      style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                      className="p-3"
                      placeholder="Project duration"
                      type="date"
                      name="duration"
                      rows={5}
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </div>
              <div className="col-md-6">
                <FormGroup>
                  <label className="">End date</label>
                  <InputGroup className="input-group-alternative">
                    <Input
                      style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                      className="p-3"
                      placeholder="Project duration"
                      type="date"
                      name="endDate"
                      rows={5}
                      required
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </div>
            </div>
          </div>
        </div>
        <FormGroup className="mt-4">
          <InputGroup className="input-group-alternative">
            <Select
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#F2F2F2",
                  minHeight: "100%",
                  height: "100%",
                }),
                valueContainer: (provided) => ({
                  ...provided,
                  height: "100%",
                  padding: "0 6px",
                }),
                input: (provided) => ({
                  ...provided,
                  margin: "0px",
                }),
                indicatorsContainer: (provided) => ({
                  ...provided,
                  height: "55px",
                }),
              }}
              className="w-100"
              placeholder="Select related fields"
              required
              onChange={onThematicAreaChange}
              options={areas.map((category) => ({
                value: category.name,
                label: category.name,
              }))}
              isMulti
            />
          </InputGroup>
        </FormGroup>
        <div className="row">
          <div className="col-md-6">
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Project cost (NGN)"
                  type="number"
                  name="cost"
                  rows={5}
                  required
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cost: e.target.value,
                    }))
                  }
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText
                    style={{
                      backgroundColor: "#F2F2F2",
                      height: "100%",
                    }}
                  >
                    | NGN
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </div>
          <div className="col-md-6">
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <Input
                  style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                  className="p-3"
                  placeholder="Amount raised (NGN)"
                  type="number"
                  name="raised"
                  rows={5}
                  required
                  value={formData.raised}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      raised: e.target.value,
                    }))
                  }
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText
                    style={{
                      backgroundColor: "#F2F2F2",
                      height: "100%",
                    }}
                  >
                    | NGN
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </div>
        </div>
        <FormGroup className="">
          <InputGroup className="input-group-alternative">
            <Input
              style={{ backgroundColor: "#F2F2F2", height: "100%" }}
              className="p-3"
              placeholder="Project manager's email"
              type="email"
              name="orgemail"
              required
              value={formData.orgemail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  orgemail: e.target.value,
                }))
              }
            />
          </InputGroup>
        </FormGroup>

        <div className="d-flex justify-content-between pt-4">
          <button
            onClick={handleExit}
            type="button"
            className="btn btn-outline-success px-5 py-3"
          >
            Exit
          </button>
          <Button
            onClick={handleNextStep}
            className="btn px-5 py-3"
            disabled={
              !formData.title ||
              !formData.description ||
              !formData.status ||
              !formData.endDate ||
              !formData.cost ||
              !formData.raised ||
              !formData.orgemail ||
              !formData.interest_area
            }
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

export default Details;

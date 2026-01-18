/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "react-select";
import { Form, FormGroup, Input, InputGroup } from "reactstrap";
import UploadFileForm from "../UploadFile/UploadFileForm";

interface ManualEntryFormProps {
  formData: {
    name: string;
    registrationNumber: string;
    description: string;
    interestArea?: string | string[];
    email?: string;
    phone?: string;
    address?: string;
    state?: string;
    country?: string;
    contactPerson?: string;
    contactTitle?: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  currentStep?: number;
  uploadFile?: File | undefined;
  onFile?: (file: File) => void;
  areas?: Array<{ name: string }>;
  onThematicAreaChange?: (selected: any) => void;
}

export default function ManualEntryForm({
  formData,
  onChange,
  onSubmit,
  currentStep = 1,
  uploadFile,
  onFile,
  areas = [],
  onThematicAreaChange,
}: ManualEntryFormProps) {
  return (
    <Form onSubmit={onSubmit}>
      {currentStep === 1 && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h5
              style={{
                margin: 0,
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              Basic Information
            </h5>
            <div>1/4</div>
          </div>

          <FormGroup className="">
            <label
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Organization Name <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Enter NGO name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={onChange}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mt-4">
            <label
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Registration Number <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="CAC Regsitration Number"
                type="text"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={onChange}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mt-4">
            <label
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Focus Areas <span style={{ color: "red" }}>*</span>
            </label>
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

          <FormGroup className="mt-4">
            <label
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Description
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Brief description of organization's mission and activities"
                type="textarea"
                name="description"
                rows={5}
                value={formData.description}
                onChange={onChange}
              />
            </InputGroup>
          </FormGroup>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h5
              style={{
                margin: 0,
                fontWeight: 700,
                color: "#1a1a1a",
              }}
            >
              Contact Information
            </h5>
            <div>2/4</div>
          </div>

          <FormGroup className="">
            <label
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Contact Person <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Enter contact person's name"
                type="text"
                name="contactPerson"
                required
                value={formData.contactPerson || ""}
                onChange={onChange}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mt-4">
            <label
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Title/Position <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Enter contact person's title or position"
                type="text"
                name="contactTitle"
                required
                value={formData.contactTitle || ""}
                onChange={onChange}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mt-4">
            <label
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Email Address <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Enter email address"
                type="email"
                name="email"
                required
                value={formData.email || ""}
                onChange={onChange}
              />
            </InputGroup>
          </FormGroup>

          <FormGroup className="mt-4">
            <label
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Phone Number <span style={{ color: "red" }}>*</span>
            </label>
            <InputGroup className="input-group-alternative">
              <Input
                style={{ backgroundColor: "#F2F2F2", height: "100%" }}
                className="p-3"
                placeholder="Enter phone number"
                type="tel"
                name="phone"
                required
                value={formData.phone || ""}
                onChange={onChange}
              />
            </InputGroup>
          </FormGroup>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <div className="mb-4">
            <h2 style={{ color: "black" }} className="h4 fw-bold mb-2">
              Review Information
            </h2>
            <p className="text-muted mb-0">
              Please verify your organization details
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px 0",
                }}
              >
                Organization Name
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {formData.name || "—"}
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px 0",
                }}
              >
                Registration Number
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {formData.registrationNumber || "—"}
              </p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px 0",
                }}
              >
                Interest Areas
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {Array.isArray(formData.interestArea)
                  ? formData.interestArea.join(", ") || "—"
                  : formData.interestArea || "—"}
              </p>
            </div>

            <div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px 0",
                }}
              >
                Description
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {formData.description || "—"}
              </p>
            </div>

            <div
              style={{
                marginTop: "16px",
                borderTop: "1px solid #e5e7eb",
                paddingTop: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px 0",
                }}
              >
                Contact Person
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {formData.contactPerson || "—"}
              </p>
            </div>

            <div style={{ marginTop: "16px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px 0",
                }}
              >
                Title/Position
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {formData.contactTitle || "—"}
              </p>
            </div>

            <div style={{ marginTop: "16px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px 0",
                }}
              >
                Email Address
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {formData.email || "—"}
              </p>
            </div>

            <div style={{ marginTop: "16px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "0 0 4px 0",
                }}
              >
                Phone Number
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {formData.phone || "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStep === 4 && onFile && (
        <div>
          <div className="mb-4">
            <h2 style={{ color: "black" }} className="h4 fw-bold mb-2">
              Supporting Documents
            </h2>
            <p className="text-muted mb-0">
              Upload any supporting documents for your organization
            </p>
          </div>
          <UploadFileForm
            uploadFile={uploadFile}
            onFile={onFile}
            showHeader={false}
            showRequirements={false}
          />
        </div>
      )}
    </Form>
  );
}

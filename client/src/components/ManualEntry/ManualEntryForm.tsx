import { Form, FormGroup, Input, Label } from "reactstrap";

interface ManualEntryFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    country: string;
    description: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ManualEntryForm({
  formData,
  onChange,
  onSubmit,
}: ManualEntryFormProps) {
  return (
    <Form onSubmit={onSubmit}>
      <FormGroup>
        <Label for="name" style={{ fontWeight: 600, marginBottom: "8px" }}>
          NGO Name *
        </Label>
        <Input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Enter NGO name"
          style={{
            borderRadius: "6px",
            borderColor: "#d1d5db",
            fontSize: "14px",
          }}
        />
      </FormGroup>

      <FormGroup>
        <Label for="email" style={{ fontWeight: 600, marginBottom: "8px" }}>
          Email *
        </Label>
        <Input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Enter email address"
          style={{
            borderRadius: "6px",
            borderColor: "#d1d5db",
            fontSize: "14px",
          }}
        />
      </FormGroup>

      <FormGroup>
        <Label for="phone" style={{ fontWeight: 600, marginBottom: "8px" }}>
          Phone
        </Label>
        <Input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="Enter phone number"
          style={{
            borderRadius: "6px",
            borderColor: "#d1d5db",
            fontSize: "14px",
          }}
        />
      </FormGroup>

      <FormGroup>
        <Label for="address" style={{ fontWeight: 600, marginBottom: "8px" }}>
          Address
        </Label>
        <Input
          type="text"
          name="address"
          id="address"
          value={formData.address}
          onChange={onChange}
          placeholder="Enter address"
          style={{
            borderRadius: "6px",
            borderColor: "#d1d5db",
            fontSize: "14px",
          }}
        />
      </FormGroup>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        <FormGroup>
          <Label for="state" style={{ fontWeight: 600, marginBottom: "8px" }}>
            State
          </Label>
          <Input
            type="text"
            name="state"
            id="state"
            value={formData.state}
            onChange={onChange}
            placeholder="Enter state"
            style={{
              borderRadius: "6px",
              borderColor: "#d1d5db",
              fontSize: "14px",
            }}
          />
        </FormGroup>

        <FormGroup>
          <Label for="country" style={{ fontWeight: 600, marginBottom: "8px" }}>
            Country
          </Label>
          <Input
            type="text"
            name="country"
            id="country"
            value={formData.country}
            onChange={onChange}
            placeholder="Enter country"
            style={{
              borderRadius: "6px",
              borderColor: "#d1d5db",
              fontSize: "14px",
            }}
          />
        </FormGroup>
      </div>

      <FormGroup>
        <Label
          for="description"
          style={{ fontWeight: 600, marginBottom: "8px" }}
        >
          Description
        </Label>
        <Input
          type="textarea"
          name="description"
          id="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Enter NGO description"
          style={{
            borderRadius: "6px",
            borderColor: "#d1d5db",
            fontSize: "14px",
          }}
          rows={4}
        />
      </FormGroup>
    </Form>
  );
}

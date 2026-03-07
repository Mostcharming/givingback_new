import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input } from "reactstrap";
import useBackendService from "../../../services/backend_service";
import { useContent } from "../../../services/useContext";

export default function Support() {
  const { authState } = useContent();
  const [form, setForm] = useState({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendSupportForm = useBackendService("/send_support", "POST", {
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setIsSubmitting(false);
      setForm({ title: "", content: "" });
    },
    onError: () => {
      toast.error("Failed to send message. Please try again later.");
      setIsSubmitting(false);
    },
  }).mutate;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sendSupportForm({
      name: authState.user?.name || "",
      email: authState.user?.email || "",
      subject: form.title,
      message: form.content,
      phoneNumber: authState.user?.phoneNumber || "",
    });
  };

  return (
    <div className="py-4" style={{ maxWidth: 600 }}>
      <h4 className="fw-bold mb-2">Support</h4>
      <p className="text-muted mb-4">
        Reach out to us. We’d love to hear from you
      </p>
      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3">
          <Input
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter title"
            required
            style={{
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#F2F2F2",
              height: "55px",
            }}
            className="p-3"
          />
        </FormGroup>
        <FormGroup className="mb-4">
          <Input
            type="textarea"
            name="content"
            id="content"
            value={form.content}
            onChange={handleChange}
            placeholder="How can we help?"
            required
            rows={6}
            style={{
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#F2F2F2",
            }}
            className="p-3"
          />
        </FormGroup>
        <Button
          type="submit"
          color="success"
          className="px-4 py-2 fw-bold"
          style={{ backgroundColor: "#02a95c", borderColor: "#02a95c" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </Form>
    </div>
  );
}

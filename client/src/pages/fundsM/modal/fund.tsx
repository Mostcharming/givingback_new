import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import useBackendService from "../../../services/backend_service";

interface FundWalletModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function FundWalletModal({
  isOpen,
  toggle,
}: FundWalletModalProps) {
  const [formData, setFormData] = useState({
    country: "",
    amount: "",
    project: "",
    remark: "",
    paymentMethod: "",
  });

  const [paystackPublicKey, setPaystackPublicKey] = useState<string | null>(
    null
  );
  const [stripePublicKey, setStripePublicKey] = useState<string | null>(null);

  const isFormComplete =
    formData.country &&
    formData.amount &&
    formData.project &&
    formData.remark &&
    formData.paymentMethod;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    if (formData.paymentMethod === "paystack") {
      if (!paystackPublicKey) {
        toast.error("Paystack key missing");
        return;
      }

      // TODO: Implement Paystack logic here
      toast.success("Paystack payment initiated");
    } else if (formData.paymentMethod === "stripe") {
      if (!stripePublicKey) {
        toast.error("Stripe key missing");
        return;
      }

      // TODO: Implement Stripe logic here
      toast.success("Stripe payment initiated");
    }
  };

  const { mutate: paymentGateways } = useBackendService(
    "/admin/payment-gateways",
    "GET",
    {
      onSuccess: (res2: any) => {
        const paystack = res2.find(
          (gateway: any) => gateway.name.toLowerCase() === "paystack"
        );
        if (paystack?.public_key) {
          setPaystackPublicKey(paystack.public_key);
        } else {
          toast.error("Paystack configuration not found.");
        }

        const stripe = res2.find(
          (gateway: any) => gateway.name.toLowerCase() === "stripe"
        );
        if (stripe?.public_key) {
          setStripePublicKey(stripe.public_key);
        } else {
          toast.error("Stripe configuration not found.");
        }
      },
      onError: () => {
        toast.error("Failed to load payment gateways.");
      },
    }
  );

  useEffect(() => {
    if (isOpen) {
      paymentGateways({});
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered
      size="md"
      className="fund-wallet-modal"
    >
      <ModalHeader toggle={toggle} className="border-0 pb-0">
        <h4 className="mb-0 fw-normal text-dark">Fund wallet</h4>
      </ModalHeader>

      <ModalBody className="px-4 py-3">
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-3">
            <Input
              type="select"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="form-control-lg bg-light border-0 text-muted"
              style={{
                borderRadius: "12px",
                padding: "20px",
                fontSize: "16px",
                height: "auto",
              }}
            >
              <option value="" disabled>
                Select country
              </option>
              <option value="us">Nigeria</option>
              <option value="uk">International</option>
            </Input>
          </FormGroup>

          <FormGroup className="mb-3">
            <Input
              type="text"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="form-control-lg bg-light border-0"
              style={{
                borderRadius: "12px",
                padding: "20px",
                fontSize: "16px",
                height: "auto",
              }}
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <Input
              type="select"
              name="project"
              value={formData.project}
              onChange={handleInputChange}
              className="form-control-lg bg-light border-0 text-muted"
              style={{
                borderRadius: "12px",
                padding: "20px",
                fontSize: "16px",
                height: "auto",
              }}
            >
              <option value="" disabled>
                Attach project
              </option>
              <option value="project1">Project Alpha</option>
              <option value="project2">Project Beta</option>
              <option value="project3">Project Gamma</option>
            </Input>
          </FormGroup>

          {formData.country && (
            <FormGroup className="mb-3">
              <Input
                type="select"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="form-control-lg bg-light border-0 text-muted"
                style={{
                  borderRadius: "12px",
                  padding: "20px",
                  fontSize: "16px",
                  height: "auto",
                }}
              >
                <option value="" disabled>
                  Select Payment Method
                </option>
                {formData.country === "us" && paystackPublicKey && (
                  <option value="paystack">Paystack</option>
                )}
                {formData.country === "uk" && stripePublicKey && (
                  <option value="stripe">Stripe</option>
                )}
              </Input>
            </FormGroup>
          )}

          <FormGroup className="mb-0">
            <Input
              type="textarea"
              name="remark"
              placeholder="Remark"
              value={formData.remark}
              onChange={handleInputChange}
              rows={4}
              className="form-control-lg bg-light border-0"
              style={{
                borderRadius: "12px",
                padding: "20px",
                fontSize: "16px",
                height: "auto",
                resize: "none",
              }}
            />
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter className="border-0 px-4 pb-4">
        <Button
          type="submit"
          className={`w-100 btn-lg fw-normal border-0 ${
            isFormComplete ? "text-white" : "text-dark bg-light"
          }`}
          style={{
            backgroundColor: isFormComplete ? "#128330" : "transparent",
            borderRadius: "12px",
            padding: "20px",
            fontSize: "16px",
            height: "auto",
          }}
          onClick={handleSubmit}
        >
          Fund Wallet
        </Button>
      </ModalFooter>

      <style>{`
        .fund-wallet-modal .modal-content {
          border-radius: 16px;
          border: none;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .fund-wallet-modal .modal-header .btn-close {
          font-size: 1.2rem;
          opacity: 0.6;
        }

        .fund-wallet-modal .form-control:focus,
        .fund-wallet-modal .form-select:focus {
          box-shadow: none;
          border-color: transparent;
          background-color: #f8f9fa;
        }
      `}</style>
    </Modal>
  );
}

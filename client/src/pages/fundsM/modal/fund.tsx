import { loadStripe } from "@stripe/stripe-js";
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
import { useContent } from "../../../services/useContext";

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
  const { authState, currentState } = useContent();
  const [clientSecret, setClientSecret] = useState(null);

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
  const { mutate: fundPost } = useBackendService("/fund", "POST", {
    onSuccess: (res2: any) => {
      toggle();
    },
    onError: () => {},
  });
  const { mutate: stripeS } = useBackendService("/stripe_session", "POST", {
    onSuccess: (res2: any) => {
      if (res2?.wholeResponse) {
        console.log(clientSecret);
        clientSecret.redirectToCheckout({ sessionId: res2.wholeResponse.id });
      } else {
        toast.error("Stripe session creation failed");
      }
    },
    onError: () => {},
  });

  useEffect(() => {
    if (isOpen) {
      paymentGateways({});
    }
  }, [isOpen]);

  const handlePaystackPayment = () => {
    if (!paystackPublicKey) return;
    const paymentData = {
      email: currentState.user.email,
      amount: parseFloat(formData.amount) * 100,
      reference: Date.now().toString(),
      currency: "NGN",
    };

    const handler = (window as any).PaystackPop.setup({
      key: paystackPublicKey,
      email: paymentData.email,
      amount: paymentData.amount,
      currency: paymentData.currency,
      ref: paymentData.reference,
      metadata: {
        project: formData.project,
        remark: formData.remark,
      },
      callback: function (response: any) {
        toast.success("Payment successful: " + response.reference);

        const paymentDetails = {
          user_id: authState.user.id,
          payment_gateway: "Paystack",
          transactionId: response.reference,
          status: response.status,
          currency: paymentData.currency,
          amount: parseFloat(formData.amount),
        };
        fundPost(paymentDetails);
      },
      onClose: function () {
        toast.info("Payment cancelled.");
      },
    });

    handler.openIframe();
  };
  const handleStripePayment = async () => {
    if (!stripePublicKey) return;

    const stripe = await loadStripe(stripePublicKey);
    if (!stripe) {
      toast.error("Stripe failed to initialize");
      return;
    }
    setClientSecret(stripe);

    stripeS({ amount: +formData.amount * 100, currency: "usd" });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    if (formData.paymentMethod === "paystack") {
      handlePaystackPayment();
    } else if (formData.paymentMethod === "stripe") {
      handleStripePayment();
    }
  };

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

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
  const [stripe, setStripe] = useState<any>(null);
  const [projects, setProjects] = useState([]);
  const [paystackPublicKey, setPaystackPublicKey] = useState<string | null>(
    null
  );
  const [stripePublicKey, setStripePublicKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const { mutate: fetchUsers } = useBackendService("/allprojects", "GET", {
    onSuccess: (res: any) => {
      setProjects(
        res.projects.map((project) => ({
          value: project.id,
          label: project.title,
        }))
      );
    },
    onError: () => {
      toast.error("Failed to fetch Projects.");
    },
  });

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

        const stripeGateway = res2.find(
          (gateway: any) => gateway.name.toLowerCase() === "stripe"
        );
        if (stripeGateway?.public_key) {
          setStripePublicKey(stripeGateway.public_key);
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
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      window.location.reload();
      toggle();
    },
    onError: (error: any) => {
      toast.error(
        "Failed to record payment: " + (error?.message || "Unknown error")
      );
    },
  });

  const { mutate: verifyStripePayment } = useBackendService(
    "/verify-stripe-payment",
    "POST",
    {
      onSuccess: (res: any) => {
        if (res.success) {
          toast.success("Payment verified successfully!");
          toggle();
        } else {
          toast.error("Payment verification failed");
        }
      },
      onError: (error: any) => {
        toast.error(
          "Failed to verify payment: " + (error?.message || "Unknown error")
        );
      },
    }
  );
  const { mutate: createStripeSession } = useBackendService(
    "/stripe_session",
    "POST",
    {
      onSuccess: (res2: any) => {
        if (res2?.sessionId) {
          localStorage.setItem("stripe_session_id", res2?.sessionId);
          if (stripe) {
            stripe.redirectToCheckout({ sessionId: res2.sessionId });
          } else {
            toast.error("Stripe not initialized properly");
          }
        } else {
          toast.error("Stripe session creation failed");
        }
        setIsProcessing(false);
      },
      onError: (error: any) => {
        toast.error(
          "Failed to create Stripe session: " +
            (error?.message || "Unknown error")
        );
        setIsProcessing(false);
      },
    }
  );

  useEffect(() => {
    const checkStripeCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get("status");

      if (status) {
        try {
          const sessionId = localStorage.getItem("stripe_session_id");

          verifyStripePayment({
            sessionId: sessionId,
            status: status,
            user_id: authState.user?.id,
            amount: formData.amount,
          });

          localStorage.removeItem("stripe_session_id");
        } catch (error) {
          console.error("Error decoding session ID:", error);
          toast.error("Invalid payment callback");
        }
      }
    };

    if (authState.user?.id) {
      checkStripeCallback();
    }
  }, [authState.user?.id]);

  useEffect(() => {
    const initializeStripe = async () => {
      if (stripePublicKey) {
        try {
          const stripeInstance = await loadStripe(stripePublicKey);
          setStripe(stripeInstance);
        } catch (error) {
          console.error("Failed to initialize Stripe:", error);
          toast.error("Failed to initialize Stripe");
        }
      }
    };

    initializeStripe();
  }, [stripePublicKey]);

  useEffect(() => {
    if (isOpen) {
      paymentGateways({});
      fetchUsers({
        limit: 1000,
        projectType: "present",
        status: "active",
        organization_id: currentState.user.id,
      });
    }
  }, [isOpen]);

  const handlePaystackPayment = () => {
    if (!paystackPublicKey) {
      toast.error("Paystack not configured");
      return;
    }

    setIsProcessing(true);
    const paymentData = {
      email: currentState.user.email,
      amount: parseFloat(formData.amount) * 100,
      reference: Date.now().toString(),
      currency: "NGN",
    };

    const handler = (window as any).PaystackPop.setup({
      key: paystackPublicKey,
      email: "mostcharming920@gmail.com",
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
          project_id: formData.project,
          remark: formData.remark,
        };
        fundPost(paymentDetails);
        setIsProcessing(false);
      },
      onClose: function () {
        toast.info("Payment cancelled.");
        setIsProcessing(false);
      },
    });

    handler.openIframe();
  };

  const handleStripePayment = async () => {
    if (!stripePublicKey || !stripe) {
      toast.error("Stripe not initialized");
      return;
    }

    setIsProcessing(true);

    try {
      const baseUrl = window.location.origin + window.location.pathname;

      const sessionData = {
        amount: Math.round(parseFloat(formData.amount) * 100),
        currency: "usd",
        project_id: formData.project,
        remark: formData.remark,
        user_id: authState.user.id,
        success_url: `${baseUrl}?status=success`,
        cancel_url: `${baseUrl}?status=cancelled`,
      };

      createStripeSession(sessionData);
    } catch (error) {
      console.error("Stripe payment error:", error);
      toast.error("Failed to initiate Stripe payment");
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete || isProcessing) return;

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
              <option value="ng">Nigeria</option>
              <option value="intl">International</option>
            </Input>
          </FormGroup>

          <FormGroup className="mb-3">
            <Input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="1"
              step="0.01"
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
              {projects.map((project) => (
                <option key={project.value} value={project.value}>
                  {project.label}
                </option>
              ))}
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
                {formData.country === "ng" && paystackPublicKey && (
                  <option value="paystack">Paystack</option>
                )}
                {formData.country === "intl" && stripePublicKey && (
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
            isFormComplete && !isProcessing
              ? "text-white"
              : "text-dark bg-light"
          }`}
          style={{
            backgroundColor:
              isFormComplete && !isProcessing ? "#128330" : "transparent",
            borderRadius: "12px",
            padding: "20px",
            fontSize: "16px",
            height: "auto",
          }}
          onClick={handleSubmit}
          disabled={!isFormComplete || isProcessing}
        >
          {isProcessing ? "Processing..." : "Fund Wallet"}
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

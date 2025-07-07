import { useState } from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

interface WithdrawFundsModalProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function WithdrawFundsModal({
  isOpen,
  toggle,
}: WithdrawFundsModalProps) {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [saveAccount, setSaveAccount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const isFormComplete =
    amount.trim() !== "" && accountNumber.trim() !== "" && bank !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormComplete) return;

    setIsProcessing(true);
    setMessage("");

    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          accountNumber,
          bank,
          saveAccount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Withdrawal request sent successfully.");
        setAmount("");
        setAccountNumber("");
        setBank("");
        setSaveAccount(false);
        toggle();
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (e) {
      setMessage("Failed to connect. Please try again.");
    } finally {
      setIsProcessing(false);
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
      <ModalHeader toggle={toggle} className="border-0 pb-2 mb-3">
        <h5 className="mb-0 fw-normal text-dark">Withdraw funds</h5>
      </ModalHeader>
      <ModalBody className="pt-0">
        <Form onSubmit={handleSubmit}>
          <FormGroup className="mb-4">
            <Input
              type="number"
              placeholder="Amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-control-lg bg-light border-0 text-muted"
              style={{
                borderRadius: "12px",
                padding: "20px",
                fontSize: "16px",
                height: "auto",
              }}
            />
          </FormGroup>

          <FormGroup className="mb-4">
            <Input
              type="text"
              placeholder="Recipient account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="form-control-lg bg-light border-0 text-muted"
              style={{
                borderRadius: "12px",
                padding: "20px",
                fontSize: "16px",
                height: "auto",
              }}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <Input
              type="select"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="form-control-lg bg-light border-0 text-muted"
              style={{
                borderRadius: "12px",
                padding: "20px",
                fontSize: "16px",
                height: "auto",
              }}
            >
              <option value="">Select bank</option>
              <option value="GT Bank">GT Bank</option>
              <option value="First Bank">First Bank</option>
              <option value="Access Bank">Access Bank</option>
              <option value="Zenith Bank">Zenith Bank</option>
            </Input>
          </FormGroup>

          <FormGroup check className="mb-4">
            <Row className="align-items-center">
              <Col xs="auto">
                <Input
                  type="checkbox"
                  checked={saveAccount}
                  onChange={(e) => setSaveAccount(e.target.checked)}
                  style={{
                    borderRadius: "12px",
                    padding: "20px",
                    fontSize: "16px",
                    height: "auto",
                  }}
                />
              </Col>
              <Col>
                <div
                  className="text-dark fw-medium mt-4"
                  style={{ fontSize: "16px" }}
                >
                  Save bank account for recurring payment
                </div>
              </Col>
            </Row>
          </FormGroup>

          {message && (
            <div
              className="text-center text-danger mb-3"
              style={{ fontSize: "15px" }}
            >
              {message}
            </div>
          )}

          <ModalFooter className="border-0 px-0 pb-0">
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
              disabled={!isFormComplete || isProcessing}
            >
              {isProcessing ? "Processing..." : "Withdraw"}
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>

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

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
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
import useBackendService from "../../../services/backend_service";
import { Banks } from "../../../services/banks";
import { useContent } from "../../../services/useContext";
import { addBankAccount } from "../../../store/reducers/userReducer";

export default function WithdrawFundsModal({
  isOpen,
  toggle,
  setShowSuccessModal,
  setShowErrorModal,
}) {
  const { currentState, authState } = useContent();
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bank, setBank] = useState("");
  const [saveAccount, setSaveAccount] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  // const exisitngAccount = currentState?.bank?.[0];
  const existingAccounts = currentState?.bank || [];
  const [selectedExistingIndex, setSelectedExistingIndex] = useState<
    number | null
  >(null);

  const isFormComplete =
    amount.trim() !== "" && accountNumber.trim() !== "" && bank !== "";
  const { mutate: withdrawFunds, isLoading: isProcessing } = useBackendService(
    "/ngo/withdraw_request",
    "POST",
    {
      onSuccess: () => {
        if (saveAccount) {
          dispatch(
            addBankAccount({
              accountName: "",
              accountNumber,
              bankName: bank,
              bvn: null, // or add BVN logic if available
            })
          );
        }

        toast.success("Withdrawal request sent successfully.");
        setMessage("");
        setAmount("");
        setAccountNumber("");
        setBank("");
        setSaveAccount(false);
        toggle();
        setShowSuccessModal(true);
      },

      onError: () => {
        const msg = "Something went wrong.";
        toast.error(msg);
        setMessage(msg);
        toggle();
        setShowErrorModal(true);
      },
    }
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormComplete) return;

    setMessage("");

    withdrawFunds({
      amount,
      accountNumber,
      bank,
      saveAccount,
    });
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
              {Banks.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
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
          {existingAccounts.length > 0 && (
            <>
              <div className="d-flex align-items-center my-3 text-muted">
                <hr className="flex-grow-1 me-2" />
                <span>or</span>
                <hr className="flex-grow-1 ms-2" />
              </div>

              {existingAccounts.map((account, index) => (
                <FormGroup check className="mb-3" key={index}>
                  <Row className="align-items-center">
                    <Col xs="auto">
                      <Input
                        type="checkbox"
                        name="existingAccount"
                        checked={selectedExistingIndex === index}
                        // onChange={() => {
                        //   setSelectedExistingIndex(index);
                        //   setAccountNumber(account.accountNumber);
                        //   setBank(account.bankName);
                        // }}
                        onChange={() => {
                          if (selectedExistingIndex === index) {
                            setSelectedExistingIndex(null);
                            setAccountNumber("");
                            setBank("");
                          } else {
                            setSelectedExistingIndex(index);
                            setAccountNumber(account.accountNumber);
                            setBank(account.bankName);
                          }
                        }}
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
                        className="text-dark fw-medium"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <p className="mb-1">{account.accountName}</p>
                          <small className="text-muted">
                            {account.accountNumber}
                          </small>
                        </div>
                        <div>{account.bankName}</div>
                      </div>
                    </Col>
                  </Row>
                </FormGroup>
              ))}
            </>
          )}
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

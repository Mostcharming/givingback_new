/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreditCard, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
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
import {
  addBankAccount,
  removeBankAccount,
} from "../../../store/reducers/userReducer";

export default function BankDetails() {
  const { currentState } = useContent();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    bank: "",
    accountNumber: "",
    accountName: "",
  });

  const bankDetails = currentState?.bank || [];

  const toggleLinkModal = () => {
    setIsLinkModalOpen(!isLinkModalOpen);
    if (!isLinkModalOpen) {
      setFormData({ bank: "", accountNumber: "", accountName: "" });
    }
  };

  const { mutate: linkBankAccount, isLoading: isLinking } = useBackendService(
    "/auth",
    "PUT",
    {
      onSuccess: () => {
        dispatch(
          addBankAccount({
            bankName: formData.bank,
            accountNumber: formData.accountNumber,
            accountName: formData.accountName,
            bvn: null,
          })
        );
        toast.success("Bank account linked successfully!");
        setFormData({ bank: "", accountNumber: "", accountName: "" });
        setIsLinkModalOpen(false);
        setShowSuccessModal(true);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Failed to link bank account";
        toast.error(errorMessage);
        setShowErrorModal(true);
        setIsLinkModalOpen(false);
      },
    }
  );

  const { mutate: deleteBankAccount, isLoading: isDeleting } =
    useBackendService(`/auth/bank/${selectedBank?.id}`, "DELETE", {
      onSuccess: () => {
        dispatch(removeBankAccount(selectedBank.id));
        toast.success("Bank account deleted successfully!");
        setShowDeleteConfirmModal(false);
        setSelectedBank(null);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.error || "Failed to delete bank account";
        toast.error(errorMessage);
      },
    });

  const isFormComplete =
    formData.bank.trim() !== "" &&
    formData.accountNumber.trim() !== "" &&
    formData.accountName.trim() !== "" &&
    formData.accountNumber.length >= 10;

  const handleLinkBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    linkBankAccount({
      bankName: formData.bank,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
    });
  };

  const handleDeleteClick = (bank: any) => {
    setSelectedBank(bank);
    console.log(bank);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteBank = () => {
    if (!selectedBank?.id) return;
    deleteBankAccount({});
  };

  return (
    <Container className="py-3" style={{ width: "80vw" }}>
      <CardBody className="p-4">
        {bankDetails.length === 0 ? (
          // Empty state with ATM card icon
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mb-4"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#f0f9f0",
              }}
            >
              <CreditCard size={48} color="#02a95c" />
            </div>
            <h5 className="mb-2" style={{ color: "#1e1e1e" }}>
              No Bank Account Added
            </h5>
            <p
              className="text-muted mb-4 text-center"
              style={{ maxWidth: "400px", fontSize: "14px" }}
            >
              To withdraw funds directly to your bank, you'll need to link your
              account.
            </p>
            <Button
              color="success"
              style={{
                backgroundColor: "#02a95c",
                borderColor: "#02a95c",
                padding: "0.75rem 2rem",
                fontWeight: "500",
              }}
              onClick={toggleLinkModal}
            >
              Link Bank Account
            </Button>
          </div>
        ) : (
          // Display existing bank accounts
          <div>
            <h5 className="fw-bold mb-4" style={{ color: "#1e1e1e" }}>
              Withdrawal Accounts
            </h5>
            <Row>
              {bankDetails.map((account: any, index: number) => (
                <Col md={6} className="mb-4" key={index}>
                  <Card
                    className="border-0"
                    style={{
                      backgroundColor: "#02a95c",
                      minHeight: "200px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Semi-circle design element */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "200px",
                        height: "100px",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        borderRadius: "0 0 200px 200px",
                        zIndex: 1,
                      }}
                    />
                    <CardBody
                      className="p-4 d-flex flex-column justify-content-between h-100"
                      style={{ position: "relative", zIndex: 2 }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <div
                            className="fw-bold"
                            style={{ color: "white", fontSize: "18px" }}
                          >
                            {account.bankName || "Bank Account"}
                          </div>
                        </div>
                        <button
                          className="border-0 bg-transparent"
                          onClick={() => handleDeleteClick(account)}
                          style={{ cursor: "pointer" }}
                        >
                          <Trash2 size={20} color="white" />
                        </button>
                      </div>

                      <div>
                        <div className="mb-2">
                          <div
                            className="fw-bold"
                            style={{
                              letterSpacing: "2px",
                              color: "white",
                              fontSize: "16px",
                            }}
                          >
                            {account.accountNumber}
                          </div>
                        </div>

                        <div>
                          <div
                            className="fw-bold"
                            style={{ color: "white", fontSize: "14px" }}
                          >
                            {account.accountName || "N/A"}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="mt-4">
              <Button
                color="success"
                style={{
                  backgroundColor: "#02a95c",
                  borderColor: "#02a95c",
                  padding: "0.75rem 2rem",
                  fontWeight: "500",
                }}
                onClick={toggleLinkModal}
              >
                Link another bank account
              </Button>
            </div>
          </div>
        )}
      </CardBody>

      {/* Link Bank Account Modal */}
      <Modal
        isOpen={isLinkModalOpen}
        toggle={toggleLinkModal}
        centered
        size="md"
        className="link-bank-modal"
      >
        <ModalHeader toggle={toggleLinkModal} className="border-0 pb-2 mb-3">
          <h5 className="mb-0 fw-normal text-dark">Link Bank Account</h5>
        </ModalHeader>
        <ModalBody className="pt-0">
          <Form onSubmit={handleLinkBankSubmit}>
            <FormGroup className="mb-4">
              <Input
                type="select"
                value={formData.bank}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bank: e.target.value }))
                }
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

            <FormGroup className="mb-4">
              <Input
                type="text"
                placeholder="Account Name"
                value={formData.accountName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    accountName: e.target.value,
                  }))
                }
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
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 20) {
                    setFormData((prev) => ({
                      ...prev,
                      accountNumber: value,
                    }));
                  }
                }}
                className="form-control-lg bg-light border-0 text-muted"
                style={{
                  borderRadius: "12px",
                  padding: "20px",
                  fontSize: "16px",
                  height: "auto",
                }}
                maxLength={20}
              />
            </FormGroup>

            <ModalFooter className="border-0 px-0 pb-0">
              <Button
                type="submit"
                className={`w-100 btn-lg fw-normal border-0 ${
                  isFormComplete && !isLinking
                    ? "text-white"
                    : "text-dark bg-light"
                }`}
                style={{
                  backgroundColor:
                    isFormComplete && !isLinking ? "#128330" : "transparent",
                  borderRadius: "12px",
                  padding: "20px",
                  fontSize: "16px",
                  height: "auto",
                }}
                disabled={!isFormComplete || isLinking}
              >
                {isLinking ? "Linking..." : "Link Account"}
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>

        <style>{`
          .link-bank-modal .modal-content {
            border-radius: 16px;
            border: none;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          }

          .link-bank-modal .modal-header .btn-close {
            font-size: 1.2rem;
            opacity: 0.6;
          }

          .link-bank-modal .form-control:focus,
          .link-bank-modal .form-select:focus {
            box-shadow: none;
            border-color: transparent;
            background-color: #f8f9fa;
          }
        `}</style>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        toggle={() => setShowSuccessModal(false)}
        centered
      >
        <ModalBody
          className="text-center"
          style={{
            backgroundColor: "white",
            color: "black",
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
          }}
        >
          <div className="p-3">
            <svg
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_45_18996)">
                <path
                  d="M56 112C86.9279 112 112 86.9279 112 56C112 25.0721 86.9279 0 56 0C25.0721 0 0 25.0721 0 56C0 86.9279 25.0721 112 56 112Z"
                  fill="#4CAF50"
                />
                <path
                  d="M41.6904 81.2616L70.4854 110.057C94.334 103.697 112 81.9682 112 55.9998C112 55.4698 112 54.9398 112 54.4099L89.3876 33.5645L41.6904 81.2616Z"
                  fill="#128330"
                />
                <path
                  d="M57.4128 68.543C59.886 71.0162 59.886 75.256 57.4128 77.7292L52.2898 82.8522C49.8166 85.3254 45.5769 85.3254 43.1037 82.8522L20.6684 60.2402C18.1952 57.767 18.1952 53.5273 20.6684 51.0541L25.7914 45.9311C28.2646 43.4579 32.5043 43.4579 34.9775 45.9311L57.4128 68.543Z"
                  fill="white"
                />
                <path
                  d="M77.022 29.5014C79.4952 27.0282 83.7349 27.0282 86.2081 29.5014L91.3311 34.6244C93.8043 37.0976 93.8043 41.3373 91.3311 43.8105L52.4668 82.4982C49.9936 84.9714 45.7538 84.9714 43.2807 82.4982L38.1576 77.3752C35.6844 74.902 35.6844 70.6623 38.1576 68.1891L77.022 29.5014Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_45_18996">
                  <rect width="112" height="112" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h4 className="p-3">Account Linked Successfully</h4>
          <p>
            Your bank account has been linked securely. You're now set to
            receive and manage funds seamlessly.
          </p>
          <div className="text-center">
            <Button
              className="p-3 mt-5 mb-3"
              style={{
                border: "none",
                width: "-webkit-fill-available",
                background: "#128330",
                color: "white",
              }}
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
              }}
            >
              Continue
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        toggle={() => setShowErrorModal(false)}
        centered
      >
        <ModalBody
          className="text-center"
          style={{
            backgroundColor: "white",
            color: "black",
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
          }}
        >
          <div className="p-3">
            <svg
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_45_19258)">
                <path
                  d="M56 112C86.9279 112 112 86.9279 112 56C112 25.0721 86.9279 0 56 0C25.0721 0 0 25.0721 0 56C0 86.9279 25.0721 112 56 112Z"
                  fill="#CE0303"
                />
                <path
                  d="M32.5049 81.2621L62.7131 111.47C88.1516 108.467 108.29 88.505 111.47 63.0665L81.0853 32.6816L32.5049 81.2621Z"
                  fill="#AD0E0E"
                />
                <path
                  d="M82.4982 68.3666C84.9714 70.8398 84.9714 75.0795 82.4982 77.5527L77.5518 82.4991C75.0787 84.9723 70.8389 84.9723 68.3657 82.4991L29.5014 43.6347C27.0282 41.1616 27.0282 36.9218 29.5014 34.4486L34.6244 29.3256C37.0976 26.8524 41.3373 26.8524 43.8105 29.3256L82.4982 68.3666Z"
                  fill="white"
                />
                <path
                  d="M62.0064 47.6973L47.6973 62.0064L68.366 82.4985C70.8392 84.9717 75.079 84.9717 77.5522 82.4985L82.6752 77.3755C85.1484 74.9023 85.1484 70.6626 82.6752 68.1894L62.0064 47.6973Z"
                  fill="#D6D6D6"
                />
                <path
                  d="M68.3657 29.5014C70.8389 27.0282 75.0787 27.0282 77.5518 29.5014L82.6749 34.6244C85.1481 37.0976 85.1481 41.3373 82.6749 43.8105L43.6339 82.4982C41.1607 84.9714 36.9209 84.9714 34.4477 82.4982L29.5014 77.5518C27.0282 75.0787 27.0282 70.8389 29.5014 68.3657L68.3657 29.5014Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_45_19258">
                  <rect width="112" height="112" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h4 className="p-3">Failed to Link Bank Account</h4>
          <p>
            Something went wrong while linking your bank account. Please try
            again.
          </p>
          <div className="text-center">
            <Button
              className="p-3 mt-5 mb-3"
              style={{
                border: "none",
                width: "-webkit-fill-available",
                background: "#CE0303",
                color: "white",
              }}
              type="button"
              onClick={() => {
                setShowErrorModal(false);
              }}
            >
              Try Again
            </Button>
          </div>
        </ModalBody>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        toggle={() => setShowDeleteConfirmModal(false)}
        centered
      >
        <ModalBody
          className="text-center"
          style={{
            backgroundColor: "white",
            color: "black",
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column",
            padding: "2rem",
          }}
        >
          <div className="p-3">
            <Trash2 size={64} color="#CE0303" />
          </div>
          <h4 className="p-3">Delete Bank Account?</h4>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedBank?.bankName}</strong> account ending in{" "}
            <strong>{selectedBank?.accountNumber?.slice(-4)}</strong>? This
            action cannot be undone.
          </p>
          <div className="d-flex gap-3 mt-4">
            <Button
              className="p-3 flex-grow-1"
              style={{
                border: "1px solid #ccc",
                background: "white",
                color: "#333",
              }}
              type="button"
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setSelectedBank(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="p-3 flex-grow-1"
              style={{
                border: "none",
                background: "#CE0303",
                color: "white",
              }}
              type="button"
              onClick={handleDeleteBank}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </Container>
  );
}

import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

interface AddEventModalProps {
  show: boolean;
  onClose: () => void;
  onAdd?: (event: {
    title: string;
    date: string;
    from: string;
    to: string;
  }) => void;
}

export default function AddEventModal({
  show,
  onClose,
  onAdd,
}: AddEventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    from: "",
    to: "",
  });

  const isFormComplete =
    formData.title.trim() !== "" &&
    formData.date !== "" &&
    formData.from !== "" &&
    formData.to !== "";

  const isTimeValid =
    isFormComplete && formData.from < formData.to;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isTimeValid) {
      onAdd?.(formData);
      setFormData({ title: "", date: "", from: "", to: "" });
      onClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      contentClassName="add-event-modal-content"
      backdropClassName="add-event-modal-backdrop"
    >
      <style>{`
        .add-event-modal-backdrop {
          background-color: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
        }
        .add-event-modal-content {
          border-radius: 10px;
          border: none;
          font-family: 'Archivo', -apple-system, Roboto, Helvetica, sans-serif;
          overflow: hidden;
          width: 600px;
          max-width: 100%;
          box-shadow: 4px 4px 10px 0 rgba(204, 204, 204, 0.2);
        }
        .modal-dialog {
          max-width: 600px;
        }
        .add-event-header {
          padding: 30px 50px 0 50px;
          border-bottom: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .add-event-header-divider {
          height: 1px;
          background: #DDD;
          margin: 17px 0 0 0;
        }
        .add-event-title {
          font-family: 'Archivo', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 18px;
          font-weight: 500;
          color: #1E1E1E;
          margin: 0;
          line-height: 1.5;
        }
        .add-event-close-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          transition: opacity 0.3s ease;
        }
        .add-event-close-btn:hover {
          opacity: 0.7;
        }
        .add-event-close-btn:hover svg path {
          stroke: #1E1E1E;
        }
        .add-event-body {
          padding: 30px 50px 30px 50px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .add-event-input-wrapper {
          position: relative;
          width: 100%;
        }
        .add-event-input {
          width: 100%;
          height: 54px;
          padding: 17px 48px 16px 16px;
          border-radius: 10px;
          background: #F6F6F6;
          border: none;
          outline: none;
          font-family: 'Archivo', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #222;
          line-height: 1.5;
        }
        .add-event-input::placeholder {
          color: rgba(34, 34, 34, 0.5);
        }
        .add-event-input:focus {
          background: #EFEFEF;
          box-shadow: none;
        }
        .add-event-input-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .add-event-submit-btn {
          width: 100%;
          height: 58px;
          border-radius: 10px;
          background: #EEE;
          border: none;
          font-family: 'Archivo', -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #444;
          cursor: not-allowed;
          margin-top: 16px;
          transition: all 0.15s ease;
        }
        .add-event-submit-btn:hover:not(:disabled) {
          background: #128330;
          color: white;
        }
        .add-event-submit-btn:disabled {
          background: #EEE;
          color: #444;
          cursor: not-allowed;
        }
        .add-event-submit-btn.enabled {
          background: #128330;
          color: white;
          cursor: pointer;
        }
        .add-event-submit-btn.enabled:hover {
          background: #0f6326;
        }
        @media (max-width: 640px) {
          .add-event-header {
            padding: 24px 24px 0 24px;
          }
          .add-event-body {
            padding: 24px 24px 24px 24px;
          }
        }
        .add-event-error-message {
          color: #d32f2f;
          font-size: 12px;
          margin-top: 4px;
          display: none;
        }
        .add-event-error-message.show {
          display: block;
        }
      `}</style>

      <div className="add-event-header">
        <h2 className="add-event-title">Add event</h2>
        <button
          className="add-event-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="#444444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#444444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="add-event-header-divider" />

      <form onSubmit={handleSubmit}>
        <div className="add-event-body">
          <div className="add-event-input-wrapper">
            <input
              className="add-event-input"
              type="text"
              name="title"
              placeholder="Event title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="add-event-input-wrapper">
            <input
              className="add-event-input"
              type="date"
              name="date"
              placeholder="Select date"
              value={formData.date}
              onChange={handleInputChange}
              required
              style={{ colorScheme: "light" }}
            />
            <span className="add-event-input-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.6665 1.66699V5.00033"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.3335 1.66699V5.00033"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.8333 3.33301H4.16667C3.24619 3.33301 2.5 4.0792 2.5 4.99967V16.6663C2.5 17.5868 3.24619 18.333 4.16667 18.333H15.8333C16.7538 18.333 17.5 17.5868 17.5 16.6663V4.99967C17.5 4.0792 16.7538 3.33301 15.8333 3.33301Z"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 8.33301H17.5"
                  stroke="#666666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <div className="add-event-input-wrapper">
            <input
              className="add-event-input"
              type="time"
              name="from"
              placeholder="From"
              value={formData.from}
              onChange={handleInputChange}
              required
              style={{ colorScheme: "light" }}
            />
            <span className="add-event-input-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_modal_from)">
                  <path
                    d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z"
                    stroke="#666666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 5V10L13.3333 11.6667"
                    stroke="#666666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_modal_from">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </div>

          <div className="add-event-input-wrapper">
            <input
              className="add-event-input"
              type="time"
              name="to"
              placeholder="To"
              value={formData.to}
              onChange={handleInputChange}
              required
              style={{ colorScheme: "light" }}
            />
            <span className="add-event-input-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_modal_to)">
                  <path
                    d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z"
                    stroke="#666666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 5V10L13.3333 11.6667"
                    stroke="#666666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_modal_to">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>
          </div>

          {isFormComplete && !isTimeValid && (
            <div className="add-event-error-message show">
              End time must be after start time
            </div>
          )}

          <button
            type="submit"
            className={`add-event-submit-btn ${
              isTimeValid ? "enabled" : ""
            }`}
            disabled={!isTimeValid}
          >
            Add event
          </button>
        </div>
      </form>
    </Modal>
  );
}

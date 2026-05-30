import React, { useEffect, useState } from "react";
import { useOnboarding } from "../contexts/OnboardingContext";

interface OnboardingStep {
  title: string;
  description: string;
  sidebarLink: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Explore Project Briefs",
    description:
      "Browse open funding opportunities, apply to relevant briefs, and connect with sponsors who align with your mission.",
    sidebarLink: "briefs",
  },
  {
    title: "Manage Your Projects",
    description:
      "View and manage all your projects in one place, track progress, and update sponsors on your achievements.",
    sidebarLink: "projects",
  },
  {
    title: "Connect with Sponsors",
    description:
      "Build lasting relationships with sponsors through direct messaging and collaborative project updates.",
    sidebarLink: "messages",
  },
  {
    title: "Track Your Funds",
    description:
      "Monitor all your fund receipts, disbursements, and wallet management in our secure system.",
    sidebarLink: "fund_management",
  },
  {
    title: "Build Your Profile",
    description:
      "Create a compelling organization profile that showcases your mission, impact history, and areas of expertise to attract the right sponsors.",
    sidebarLink: "profile",
  },
  {
    title: "Welcome to Your Dashboard",
    description:
      "Here's your command center where you can track all your activities, view recent transactions, and monitor your organization's impact.",
    sidebarLink: "dashboard",
  },
];

interface NGOOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightedSidebarItem?: string;
}

const NGOOnboardingModal: React.FC<NGOOnboardingModalProps> = ({
  isOpen,
  onClose,
  highlightedSidebarItem,
}) => {
  const [step, setStep] = useState(0);
  const { setSidebarLink } = useOnboarding();
  const current = onboardingSteps[step];
  const total = onboardingSteps.length;
  const isLastStep = step === total - 1;

  // Update sidebar link when step changes
  useEffect(() => {
    if (isOpen) {
      setSidebarLink(current.sidebarLink);
    }
  }, [step, isOpen, current.sidebarLink, setSidebarLink]);

  const handleNext = () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setSidebarLink(null);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  if (!isOpen) return null;

  const handleCloseModal = () => {
    setSidebarLink(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop - excludes sidebar from blur */}
      <div
        onClick={handleCloseModal}
        style={{
          position: "fixed",
          top: 0,
          left: "256px",
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Sidebar overlay - solid background without blur */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "256px",
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 999,
          pointerEvents: "none",
        }}
      />

      {/* Modal - positioned next to sidebar */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "280px",
          transform: "translateY(-50%)",
          zIndex: 1001,
          width: "100%",
          maxWidth: "500px",
          padding: "20px",
          animation: "slideInFromLeft 0.3s ease-out",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
            padding: "30px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "1.5",
                color: "#1E1E1E",
                fontFamily: "Archivo",
                margin: 0,
                paddingRight: "20px",
                flex: 1,
              }}
            >
              {current.title}
            </h2>
            <button
              onClick={handleCloseModal}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
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

          {/* Description */}
          <p
            style={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "1.5",
              color: "#666666",
              fontFamily: "Archivo",
              marginBottom: "52px",
              margin: "0 0 52px 0",
            }}
          >
            {current.description}
          </p>

          {/* Footer with step counter and buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontFamily: "Archivo", color: "#444" }}>
              <span style={{ fontWeight: 500, fontSize: "18px" }}>
                {step + 1}
              </span>
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#666",
                  marginLeft: "4px",
                }}
              >
                of {total}
              </span>
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={handleCloseModal}
                style={{
                  height: "46px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  borderRadius: "10px",
                  fontFamily: "Archivo",
                  fontWeight: 500,
                  fontSize: "15px",
                  color: "#444444",
                  backgroundColor: "transparent",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                }}
              >
                Cancel
              </button>

              {isLastStep && (
                <button
                  onClick={handlePrevious}
                  style={{
                    height: "46px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    borderRadius: "10px",
                    fontFamily: "Archivo",
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "#128330",
                    backgroundColor: "transparent",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  Previous
                </button>
              )}

              <button
                onClick={handleNext}
                style={{
                  height: "46px",
                  width: "120px",
                  borderRadius: "10px",
                  backgroundColor: "#128330",
                  fontFamily: "Archivo",
                  fontWeight: 500,
                  fontSize: "15px",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "#0f6e28";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "#128330";
                }}
              >
                {isLastStep ? "Get Started" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default NGOOnboardingModal;

import { Circle, CircleCheckBig } from "lucide-react";
import { Container } from "reactstrap";
import BoxIcon from "../../../assets/images/box.svg";

export default function NGOChecks({
  hasBankDetails,
  hasAddress,
  hasActiveProject,
  isFirstTimeLogin,
}) {
  return (
    <Container fluid className="mt-4">
      <div
        style={{
          backgroundColor: "#128330",
          color: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0.1rem",
            right: "0.1rem",
            opacity: 0.2,
          }}
        >
          <div style={{ position: "relative" }}>
            <img src={BoxIcon} alt="Box Icon" />
          </div>
        </div>

        <div style={{ maxWidth: "72rem" }}>
          <h4
            style={{
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "white",
            }}
          >
            Complete Your Profile Setup
          </h4>

          <p
            style={{
              color: "white",
              marginBottom: "1.25rem",
            }}
          >
            You're almost there! Set up your account to unlock full access and
            increase visibility. Here's what to do next:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Left column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <CheckItem
                checked={hasBankDetails}
                text="Provide Bank Details – Securely receive donations"
              />
              <CheckItem
                checked={hasAddress}
                text="Add Your Organization's Bio – Tell donors about your mission"
              />
            </div>

            {/* Right column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <CheckItem
                checked={hasActiveProject}
                text="Create Your First Project – Show donors what you are capable of"
              />
              <CheckItem
                checked={isFirstTimeLogin}
                text="Explore the Dashboard – Familiarize yourself with GivingBack"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

function CheckItem({ checked, text }) {
  const Icon = checked ? CircleCheckBig : Circle;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "1rem",
      }}
    >
      <Icon style={{ width: "1rem", height: "1rem", marginTop: "0.5rem" }} />
      <div>
        <p style={{ textDecoration: "underline" }}>{text}</p>
      </div>
    </div>
  );
}

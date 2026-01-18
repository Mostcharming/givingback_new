/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, Mail, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import "./ngo-card.css";

interface NGO {
  id?: string | number;
  name: string;
  is_verified?: number | boolean;
  state?: string;
  country?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

interface NGOCardProps {
  ngo: NGO;
}

const NGOCard = ({ ngo }: NGOCardProps) => {
  const navigate = useNavigate();
  const isVerified = ngo.is_verified === 1 || ngo.is_verified === true;
  const country = ngo.country || "Nigeria";
  const state = ngo.state || "";

  const handleContactClick = () => {
    navigate("/donor/messages");
  };

  return (
    <div className="ngo-card">
      {/* First line: Name and Verification Badge */}
      <div className="ngo-card-header">
        <div className="ngo-name-section">
          <h3 className="ngo-name">{ngo.name}</h3>
          {isVerified && (
            <div className="verification-badge">
              <CheckCircle size={16} className="verification-icon" />
              <span className="verification-text">Verified</span>
            </div>
          )}
        </div>
        {!isVerified && (
          <div className="awaiting-verification">
            <span className="awaiting-verification-text">
              Awaiting verification
            </span>
          </div>
        )}
      </div>

      {/* Second line: Location, Email, Phone */}
      <div className="ngo-card-info">
        <div className="ngo-info-item">
          <MapPin size={16} className="ngo-info-icon" />
          <span className="ngo-info-text">
            {state && `${state}, `}
            {country}
          </span>
        </div>

        {ngo.email && (
          <div className="ngo-info-item">
            <Mail size={16} className="ngo-info-icon" />
            <span className="ngo-info-text">{ngo.email}</span>
          </div>
        )}

        {ngo.phone && (
          <div className="ngo-info-item">
            <Phone size={16} className="ngo-info-icon" />
            <span className="ngo-info-text">{ngo.phone}</span>
          </div>
        )}
      </div>

      {/* Third line: Contact Button */}
      <div className="ngo-card-footer">
        <Button
          onClick={handleContactClick}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 24px",
            marginTop: "20px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            boxShadow: "0 2px 8px rgba(40, 167, 69, 0.2)",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "#218838";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "#28a745";
          }}
        >
          Contact NGO
        </Button>
      </div>
    </div>
  );
};

export default NGOCard;

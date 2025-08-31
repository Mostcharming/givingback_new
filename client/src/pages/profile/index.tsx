import { useState } from "react";
import ProfileUpdateForm from "./subs/profile";

function Profile() {
  const TABS = [
    "Profile Information",
    "Bank Details",
    "Security",
    "Notifications",
    "Website",
    "Support",
  ];
  const [activeTab, setActiveTab] = useState("Profile Information");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile Information":
        return <ProfileUpdateForm />;

      case "Bank Details":
        return <div></div>;
      case "Security":
        return <div></div>;
      case "Notifications":
        return <div></div>;
      case "Website":
        return <div></div>;
      case "Support":
        return <div></div>;
      default:
        return null;
    }
  };
  return (
    <div className="container-fluid px-4 border-bottom border-2">
      <div className="row">
        <div className="col-lg-8 ">
          <ul
            style={{ width: "80vw", border: "none" }}
            className="nav nav-tabs "
          >
            {TABS.map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`nav-link border-0 p-4 ${
                    activeTab === tab ? "text-success " : "text-muted"
                  }`}
                >
                  <span
                    style={{
                      background: "transparent",
                      borderBottom:
                        activeTab === tab ? "4px solid #198754" : "",
                    }}
                  >
                    {tab}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default Profile;

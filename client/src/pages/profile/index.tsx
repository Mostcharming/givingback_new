import { useState } from "react";
import { useContent } from "../../services/useContext";
import BankDetails from "./subs/bankDetails";
import ProfileUpdateForm from "./subs/profile";

function Profile() {
  const { authState } = useContent();
  const role = authState.user?.role;

  const TABS =
    role === "donor" || role === "corporate"
      ? [
          "Profile Information",
          "Bank Details",
          "Security",
          "Notifications",
          "Support",
        ]
      : ["Profile Information"];

  const [activeTab, setActiveTab] = useState("Profile Information");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile Information":
        return <ProfileUpdateForm />;

      case "Bank Details":
        return <BankDetails />;
      case "Security":
        return <div></div>;
      case "Notifications":
        return <div></div>;
      case "Support":
        return <div></div>;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="container-fluid px-4 py-3 border-bottom border-2">
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
          </div>
        </div>
      </div>
      <div className="container-fluid px-4 border-bottom border-2">
        <div className="row">
          <div className="col-lg-8 ">{renderTabContent()}</div>
        </div>
      </div>
    </>
  );
}

export default Profile;

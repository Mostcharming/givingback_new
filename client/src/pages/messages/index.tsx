import { MessageCircle, Search } from "lucide-react";
import { Image } from "react-bootstrap";
import {
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import logo from "../../assets/images/logo.png";

function MessageDonor() {
  return (
    <>
      <div className="d-flex vh-100" style={{ backgroundColor: "#f5f7fa" }}>
        {/* Left Sidebar */}
        <div
          className="bg-white p-3 border-end"
          style={{ width: "420px", borderColor: "#e8ebf2" }}
        >
          {/* Header */}
          <div className="p-4" style={{ borderColor: "#e8ebf2" }}>
            <h1 className="h5 mb-0 fw-semibold" style={{ color: "#128330" }}>
              Messages
            </h1>
          </div>

          {/* Search */}
          <div className="p-3">
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText style={{ backgroundColor: "white" }}>
                    <Search />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  style={{ backgroundColor: "white", height: "100%" }}
                  className="p-3"
                  placeholder="Search"
                  type="search"
                />
              </InputGroup>
            </FormGroup>
          </div>

          {/* Contact List */}
          <div className="px-3 border-bottom">
            <div
              className="d-flex align-items-center p-3 rounded-2 cursor-pointer"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f1f2f7")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Image
                src={logo}
                alt="Person drinking from water tap"
                width={50}
                height={50}
                className="bg-white rounded-circle m-2"
              />
              <div className="flex-grow-1">
                <div className="d-flex align-items-center">
                  <span
                    className="fw-medium mb-0 small"
                    style={{ color: "#000000" }}
                  >
                    GivingBack Admin
                  </span>
                  <div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_45_22028)">
                        <path
                          d="M3.20825 7.18455C3.08662 6.63666 3.10529 6.06692 3.26255 5.52817C3.4198 4.98942 3.71054 4.49909 4.10781 4.10265C4.50507 3.70622 4.99601 3.41651 5.53509 3.26038C6.07417 3.10426 6.64394 3.08677 7.19158 3.20955C7.49301 2.73814 7.90825 2.35019 8.39904 2.08146C8.88983 1.81273 9.44037 1.67187 9.99992 1.67188C10.5595 1.67187 11.11 1.81273 11.6008 2.08146C12.0916 2.35019 12.5068 2.73814 12.8082 3.20955C13.3567 3.08624 13.9275 3.10364 14.4674 3.26015C15.0074 3.41665 15.4989 3.70717 15.8965 4.10468C16.294 4.50219 16.5845 4.99378 16.741 5.53372C16.8975 6.07366 16.9149 6.64441 16.7916 7.19289C17.263 7.49431 17.6509 7.90956 17.9197 8.40035C18.1884 8.89114 18.3293 9.44168 18.3293 10.0012C18.3293 10.5608 18.1884 11.1113 17.9197 11.6021C17.6509 12.0929 17.263 12.5081 16.7916 12.8096C16.9144 13.3572 16.8969 13.927 16.7408 14.466C16.5846 15.0051 16.2949 15.4961 15.8985 15.8933C15.502 16.2906 15.0117 16.5813 14.473 16.7386C13.9342 16.8958 13.3645 16.9145 12.8166 16.7929C12.5156 17.2661 12.1 17.6557 11.6084 17.9257C11.1167 18.1956 10.5649 18.3371 10.0041 18.3371C9.44323 18.3371 8.89144 18.1956 8.39981 17.9257C7.90818 17.6557 7.49261 17.2661 7.19158 16.7929C6.64394 16.9157 6.07417 16.8982 5.53509 16.7421C4.99601 16.5859 4.50507 16.2962 4.10781 15.8998C3.71054 15.5033 3.4198 15.013 3.26255 14.4743C3.10529 13.9355 3.08662 13.3658 3.20825 12.8179C2.73321 12.5173 2.34193 12.1014 2.07079 11.6089C1.79965 11.1164 1.65747 10.5634 1.65747 10.0012C1.65747 9.43905 1.79965 8.88601 2.07079 8.39354C2.34193 7.90108 2.73321 7.48518 3.20825 7.18455Z"
                          fill="#128330"
                          stroke="#128330"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M7.5 9.9987L9.16667 11.6654L12.5 8.33203"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_45_22028">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>
                <p className="mb-0 small" style={{ color: "#888888" }}>
                  Send us a message
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#e8ebf2",
              }}
            >
              <MessageCircle
                style={{ width: "32px", height: "32px", color: "#888888" }}
              />
            </div>
            <h2 className="h5 fw-medium mb-2" style={{ color: "#000000" }}>
              Select a message
            </h2>
            <p className="small mb-0" style={{ color: "#888888" }}>
              {"Select a message from the list to view it's content."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MessageDonor;

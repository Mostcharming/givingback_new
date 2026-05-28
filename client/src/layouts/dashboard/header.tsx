/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// reactstrap components
import { Bell, Calendar } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Media,
  Nav,
  Navbar,
  UncontrolledDropdown,
} from "reactstrap";
import { ThunkDispatch } from "redux-thunk";
import CalendarDrawer from "../../components/drawers/CalendarDrawer";
import NotificationsDrawer from "../../components/drawers/NotificationsDrawer";
import useBackendService from "../../services/backend_service";
import { useContent } from "../../services/useContext";
import { logout_auth } from "../../store/reducers/authReducer";
import { RootState } from "../../types";

const AdminNavbar: React.FC<any> = () => {
  const { currentState } = useContent();
  const { authState } = useContent();
  const role = authState.user?.role;
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch();
  const [openDrawer, setOpenDrawer] = useState<
    "notification" | "calendar" | null
  >(null);

  const { mutate: logout } = useBackendService("/auth/logout", "GET", {
    onSuccess: () => {
      dispatch(logout_auth());
      navigate("/");
    },
    onError: () => {},
  });

  return (
    <>
      {/* Backdrop/Overlay with blur effect */}
      {openDrawer && (
        <div
          onClick={() => setOpenDrawer(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(4px)",
            zIndex: 998,
            animation: "fadeIn 0.3s ease-in-out",
          }}
        />
      )}

      {/* Notification Drawer */}
      {openDrawer === "notification" && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 999,
            animation: "slideIn 0.3s ease-in-out",
          }}
        >
          <NotificationsDrawer onClose={() => setOpenDrawer(null)} />
        </div>
      )}

      {/* Calendar Drawer */}
      {openDrawer === "calendar" && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 999,
            animation: "slideIn 0.3s ease-in-out",
          }}
        >
          <CalendarDrawer onClose={() => setOpenDrawer(null)} />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <Navbar
        style={{
          height: "10px",
          marginBottom: "63px",
        }}
        className="navbar-top navbar-dark"
        expand="md"
        id="navbar-main"
      >
        <Container
          style={{ borderBottom: "1px solid #ccc" }}
          fluid
          className="pt-4 pb-3 align-items-center d-none d-md-flex"
          navbar
        >
          <FormGroup className="mb-0"></FormGroup>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  {role === "NGO" && (
                    <>
                      <button
                        onClick={() =>
                          setOpenDrawer(
                            openDrawer === "calendar" ? null : "calendar",
                          )
                        }
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#E2EFE9",
                          marginRight: "10px",
                          border: "none",
                          cursor: "pointer",
                          background: "none",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#d4e8e0";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.backgroundColor = "#E2EFE9";
                        }}
                      >
                        <Calendar color="#128330" size={18} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() =>
                      setOpenDrawer(
                        openDrawer === "notification" ? null : "notification",
                      )
                    }
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#E2EFE9",
                      marginRight: "10px",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#d4e8e0";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "#E2EFE9";
                    }}
                  >
                    <Bell color="#128330" size={18} />
                  </button>
                  <span
                    style={{ color: "black" }}
                    className="mb-0 text-sm font-weight-bold mr-2"
                  >
                    {currentState.user?.name}
                  </span>
                  <span className="avatar avatar-sm rounded-circle">
                    <img alt="..." src={currentState.userimage?.filename} />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span
                      style={{ color: "black" }}
                      className="mb-0 text-sm font-weight-bold"
                    >
                      <FaChevronDown className="ml-2 text-xs" />
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                {/* <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem> */}

                <DropdownItem divider />
                <DropdownItem
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    logout({});
                  }}
                >
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;

import { useNavigate } from "react-router-dom";
// reactstrap components
import { FaChevronDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  InputGroup,
  Media,
  Nav,
  Navbar,
  UncontrolledDropdown,
} from "reactstrap";
import { ThunkDispatch } from "redux-thunk";
import useBackendService from "../../services/backend_service";
import { useContent } from "../../services/useContext";
import { logout_auth } from "../../store/reducers/authReducer";
import { RootState } from "../../types";

const AdminNavbar: React.FC<any> = (props) => {
  const { currentState } = useContent();
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch();

  const { mutate: logout } = useBackendService("/auth/logout", "GET", {
    onSuccess: () => {
      dispatch(logout_auth());
      navigate("/");
    },
    onError: () => {},
  });

  return (
    <>
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
          style={{ marginTop: "50px", borderBottom: "1px solid #ccc" }}
          fluid
          className="pt-4 pb-3 align-items-center d-none d-md-flex"
          navbar
        >
          <FormGroup className="mb-0">
            <InputGroup>
              {/* <InputGroupAddon addonType="prepend">
                <InputGroupText
                  style={{
                    cursor: "pointer",
                    backgroundColor: "white",
                    height: "100%",
                  }}
                >
                  <FaSearch />
                </InputGroupText>
              </InputGroupAddon> */}
              {/* <Input
                className="p-2 form-control form-control-alternative"
                placeholder="Search NGO’s, projects, locations"
                type="text"
                style={{
                  cursor: "pointer",
                  width: "30vw",
                  // backgroundColor: "#F2F2F2",
                  height: "100%",
                }}
                // value={searchText}
                // onChange={(e) => setSearchText(e.target.value)}
              /> */}
            </InputGroup>
          </FormGroup>
          {/* <p style={{ fontWeight: "bold" }}>{getCurrentRoute()}</p> */}
          {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto"></Form> */}
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
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
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>

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

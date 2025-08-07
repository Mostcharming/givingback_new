import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, NavLink as NavLinkRRD, useNavigate } from "react-router-dom";
import {
  Col,
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Media,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { ThunkDispatch } from "redux-thunk";
import useBackendService from "../../services/backend_service";
import { useContent } from "../../services/useContext";
import { logout_auth } from "../../store/reducers/authReducer";
import { RootState } from "../../types";

interface SidebarLogo {
  innerLink?: string;
  outterLink?: string;
  imgSrc: string;
  imgAlt: string;
}

interface SidebarRoute {
  layout: string;
  path: string;
  icon: string;
  name: string;
}

const Sidebar: React.FC<any> = (props) => {
  const { currentState } = useContent();
  const [collapseOpen, setCollapseOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch();

  const { mutate: logout } = useBackendService("/auth/logout", "GET", {
    onSuccess: () => {
      dispatch(logout_auth());
      navigate("/");
    },
    onError: () => {},
  });

  const activeRoute = (routeName: string) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const createLinks = (routes: SidebarRoute[]) => {
    return routes
      .filter((prop) => prop.layout === compare && prop.name)
      .map((prop, key) => (
        <NavItem key={key} className="custom-nav-item m-2">
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
            className={`custom-nav-link`}
          >
            {prop.icon}
            <h6 className="pl-2">{prop.name}</h6>
          </NavLink>
        </NavItem>
      ));
  };

  const { compare, routes, logo } = props;

  let navbarBrandProps: React.ComponentProps<typeof Link> | undefined;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      children: (
        <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
      ),
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      to: logo.outterLink,
      target: "_blank",
      children: (
        <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
      ),
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
      style={{ border: "1px solid #ccc", overflow: "clip" }}
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Brand */}
        {logo ? (
          <NavbarBrand
            style={{ padding: 0 }}
            className="pt-0"
            {...(navbarBrandProps as any)}
          />
        ) : null}
        <Nav navbar>
          <div
            className="d-none d-md-flex"
            style={{
              padding: 0,
              paddingLeft: "20px",
              width: "100vw",
              borderBottom: "1px solid #ccc",
            }}
          />
        </Nav>

        {/* User */}

        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img alt="..." src={currentState.userimage?.filename} />
                </span>
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
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}

          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>

          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}</Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default Sidebar;

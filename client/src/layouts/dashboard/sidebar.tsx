/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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
import { useOnboarding } from "../../contexts/OnboardingContext";
import useBackendService from "../../services/backend_service";
import { useContent } from "../../services/useContext";
import { logout_auth } from "../../store/reducers/authReducer";
import { RootState } from "../../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface SidebarRoute {
  layout: string;
  path: string;
  icon: string;
  name: string;
}

interface ChatSummary {
  id: string | number;
  unreadCount?: number;
}

type ChatEvent =
  | { type: "connected" }
  | {
      type: "message";
      chatId: string | number;
      message: {
        senderUserId?: string | number;
        sender_user_id?: string | number;
      };
    };

const Sidebar: React.FC<any> = (props) => {
  const { currentState, authState } = useContent();
  const { currentSidebarLink } = useOnboarding();
  const [collapseOpen, setCollapseOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const navigate = useNavigate();
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch();

  const { mutate: logout } = useBackendService("/auth/logout", "GET", {
    onSuccess: () => {
      dispatch(logout_auth());
      navigate("/");
    },
    onError: () => {},
  });

  const { mutateAsync: fetchChats } = useBackendService<
    { chats: ChatSummary[] },
    any
  >("/chats", "GET");

  useEffect(() => {
    const loadUnreadMessagesCount = async () => {
      if (!authState.user?.id) return;

      try {
        const result = await fetchChats({});
        const totalUnread = (result.chats || []).reduce(
          (total, chat) => total + Number(chat.unreadCount || 0),
          0,
        );
        setUnreadMessagesCount(totalUnread);
      } catch (error) {
        console.error("Failed to fetch unread messages count:", error);
      }
    };

    loadUnreadMessagesCount();
    window.addEventListener(
      "chat-unread-count-refresh",
      loadUnreadMessagesCount,
    );

    if (!authState.user?.id || !authState.token) {
      return () => {
        window.removeEventListener(
          "chat-unread-count-refresh",
          loadUnreadMessagesCount,
        );
      };
    }

    const events = new EventSource(
      `${API_BASE_URL}/chats/events/stream?token=${encodeURIComponent(authState.token)}`,
    );

    events.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as ChatEvent;
        if (payload.type !== "message") return;

        const senderId =
          payload.message.senderUserId ?? payload.message.sender_user_id;
        if (String(senderId) === String(authState.user?.id)) return;

        setUnreadMessagesCount((count) => count + 1);
      } catch (error) {
        console.error("Failed to process unread chat event:", error);
      }
    };

    events.onerror = (error) => {
      console.error("Unread chat realtime connection failed:", error);
    };

    return () => {
      events.close();
      window.removeEventListener(
        "chat-unread-count-refresh",
        loadUnreadMessagesCount,
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.token, authState.user?.id]);

  // const activeRoute = (routeName: string) => {
  //   return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  // };

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  const createLinks = (routes: SidebarRoute[]) => {
    return routes
      .filter((prop) => prop.layout === compare && prop.name)
      .filter((prop) =>
        prop.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .map((prop, key) => {
        // Extract the route identifier from the path
        const routeId = prop.path.split("/")[1]; // Gets the first segment of the path
        const isHighlighted = currentSidebarLink === routeId;

        const isMessagesRoute = prop.path.includes("/messages");
        const badgeColor = unreadMessagesCount > 0 ? "#dc2626" : "#94a3b8";

        return (
          <NavItem
            key={key}
            className="custom-nav-item m-2"
            style={{
              backgroundColor: isHighlighted ? "#f0f8f4" : "transparent",
              borderRadius: "8px",
              transition: "background-color 0.2s ease",
            }}
          >
            <NavLink
              to={prop.layout + prop.path}
              tag={NavLinkRRD}
              onClick={closeCollapse}
              className={`custom-nav-link`}
              style={{
                borderLeft: isHighlighted ? "4px solid #128330" : "none",
                paddingLeft: isHighlighted ? "12px" : "16px",
                transition: "all 0.2s ease",
              }}
            >
              {prop.icon}
              <div
                className="d-flex align-items-center justify-content-between pl-2"
                style={{ flex: 1, minWidth: 0 }}
              >
                <h6
                  className="mb-0"
                  style={{
                    color: isHighlighted ? "#128330" : "inherit",
                    fontWeight: isHighlighted ? 600 : 400,
                  }}
                >
                  {prop.name}
                </h6>
                {isMessagesRoute && (
                  <span
                    aria-label={`${unreadMessagesCount} unread messages`}
                    style={{
                      alignItems: "center",
                      backgroundColor: badgeColor,
                      borderRadius: "999px",
                      color: "white",
                      display: "inline-flex",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      justifyContent: "center",
                      lineHeight: 1,
                      marginLeft: "0.5rem",
                      minWidth: "1.45rem",
                      padding: "0.25rem 0.45rem",
                    }}
                  >
                    {unreadMessagesCount}
                  </span>
                )}
              </div>
            </NavLink>
          </NavItem>
        );
      });
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
      style={{
        border: "1px solid #ccc",
        overflow: window.innerWidth >= 992 ? "clip" : "visible",
        clipPath: window.innerWidth >= 992 ? "inset(0)" : "none",
      }}
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

          <Form style={{ display: "none" }} className="mt-4 mb-3 d-md-none">
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

          {/* Search Filter */}
          <div className="py-2">
            <InputGroup className="input-group-rounded input-group-merge">
              <InputGroupAddon addonType="prepend">
                <InputGroupText style={{ backgroundColor: "transparent" }}>
                  <i className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                aria-label="Filter menu"
                className="form-control-rounded form-control-prepended"
                placeholder="Search..."
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}</Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default Sidebar;

import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Col, Container, NavbarBrand, Row } from "reactstrap";
import backgroundImage from "../../assets/images/background.jpg";
import routes from "../../routes/routes";
import { useLoadStyles } from "../../services/styles";
import Logo from "../../assets/images/home/GivingBackNG-logo.svg";
import { Link } from "react-router-dom";

const Auth = (props: any) => {
  useLoadStyles(["argon"]);

  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return <Route path={prop.path} element={prop.component} key={key} />;
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <div
        className="main-content"
        ref={mainContent}
        style={{
          minHeight: "100vh",
          background: ` url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <AuthNavbar sign={false} /> */}
        <div className="header bg-gradient-info py-5 py-lg-6">
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <NavbarBrand to="/" tag={Link}>
                    <img alt="..." src={Logo} style={{ height: "120px" }} />
                  </NavbarBrand>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Routes>
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/error" replace />} />
            </Routes>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Auth;

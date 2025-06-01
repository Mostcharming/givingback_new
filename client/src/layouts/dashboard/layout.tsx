import React, { useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import backgroundImage from "../../assets/images/background.jpg";
import Logo from "../../assets/images/home/GivingBackNG-logo.svg";

import routes from "../../routes/routes";
import AdminNavbar from "./header";
import Sidebar from "./sidebar";

interface AdminProps {
  compare?: string;
}

const Dashboard: React.FC<AdminProps> = ({ compare }) => {
  const mainContent = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes: Array<any>) => {
    return routes.map((prop, key) => {
      if (prop.layout === compare) {
        return <Route path={prop.path} element={prop.component} key={key} />;
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <Sidebar
        compare={compare}
        routes={routes}
        logo={{
          innerLink: "/dashboard",
          imgSrc: Logo,
          imgAlt: "...",
        }}
      />
      <div
        style={{
          minHeight: "100vh",
          background: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="main-content"
        ref={mainContent}
      >
        <AdminNavbar />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/error" replace />} />
        </Routes>
      </div>
    </>
  );
};

export default Dashboard;

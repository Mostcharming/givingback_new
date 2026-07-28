/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import GiveBackLogo from "../../assets/images/home/GivingBackNG-logo.svg";
import "./Header.css";
import { stickyNav } from "./util";
const Header = ({ transparentTop, transparentHeader, topSecondaryBg }) => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", stickyNav);
  });
  const navItems = [
    { name: "Home", to: "/" },
    { name: "About us", to: "/about_us" },
    { name: "Services", to: "/services" },
    { name: "Project", to: "/latest-projects" },
    { name: "Contact", to: "/contact" },
  ];
  const [hovered, setHovered] = useState(null);
  return (
    <>
      <header
        className={`site-header sticky-header d-none d-lg-block ${
          transparentTop ? "topbar-transparent" : ""
        } ${transparentHeader ? "transparent-header" : ""}`}
        id="header-sticky"
      >
        <div className="navbar-wrapper">
          <div className="container">
            <div className="d-flex">
              <div className="site-logo mr-4">
                <Link to="/">
                  <a>
                    <img src={GiveBackLogo} alt="GivingBack" />
                  </a>
                </Link>
              </div>

              <div className="ml-3 navbar-extra d-flex align-items-center">
                <div className="nav-menu pr-4" id="menu">
                  <ul className="d-flex align-items-center">
                    {navItems.map((item, index) => (
                      <li className="ml-3" key={index}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) => {
                            const isHovered = hovered === index;
                            return `
      nav-link-custom 
      ${isHovered || isActive ? "nav-link-active nav-link-hover" : ""}
    `;
                          }}
                          onMouseEnter={() => setHovered(index)}
                          onMouseLeave={() => setHovered(null)}
                        >
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>

                <a href="#" className="nav-toggler">
                  <span />
                </a>
              </div>
              <div className="d-flex align-items-center ml-auto">
                <a
                  href="/auth/login"
                  className="mr-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                  onClick={() => setIsDonateModalOpen(true)}
                  style={{ backgroundColor: "#F3FAF5", color: "#02a95c" }}
                >
                  Sign in
                </a>
                <a
                  href="/auth/register"
                  className="main-btn nav-btn d-none d-sm-inline-block cursor-pointer"
                  onClick={() => setIsDonateModalOpen(true)}
                >
                  Create Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <DonateModal
        open={isDonateModalOpen}
        handleClose={() => setIsDonateModalOpen(false)}
      /> */}
    </>
  );
};

export default Header;

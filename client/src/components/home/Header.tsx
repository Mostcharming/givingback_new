/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GiveBackLogo from "../../assets/images/home/GivingBackNG-logo.svg";
// import DonateModal from '../componenets/modals/DonateModal'
import { stickyNav } from "./util";

const Header = ({ transparentTop, transparentHeader, topSecondaryBg }) => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", stickyNav);
  });
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
                  <ul>
                    <li className="ml-3">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="ml-3">
                      <Link to="/about_us">About us</Link>
                    </li>
                    <li className="ml-3">
                      <Link to="/services">Services</Link>
                    </li>

                    <li className="ml-3">
                      <Link to="/latest-projects">Project</Link>
                    </li>
                    <li className="ml-3">
                      <Link to="/contact">Contact</Link>
                    </li>
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

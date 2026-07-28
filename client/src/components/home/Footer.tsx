import GiveBackLogo from "../../assets/images/home/GivingBackNG-logo.svg";

const Footer = ({ footerSolidBg }) => {
  return (
    <footer
      className={`border-top site-footer ${
        footerSolidBg ? "" : "with-footer-cta with-footer-bg"
      }`}
    >
      <div style={{ background: "white" }} className="footer-content-area">
        <div className="container">
          <div
            style={{ paddingTop: "0" }}
            className="footer-widgets row justify-content-between"
          >
            <div style={{ width: "40vw" }} className="widget about-widget ">
              <div className="footer-logo">
                <img src={GiveBackLogo} alt="GivingBack" />
              </div>
              <div className="newsletter-form">
                <p style={{ color: "black" }}>
                  We're on a mission to transform how donors, NGOs, and
                  communities connect and collaborate to create lasting positive
                  change around the world.
                </p>
              </div>
            </div>

            <div className="widget nav-widget">
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/about_us">About Us</a>
                </li>
                <li>
                  <a href="/services">Services</a>
                </li>
                <li>
                  <a href="/latest-projects">Projects</a>
                </li>
                <li>
                  <a href="/contact">Contact Us</a>
                </li>
              </ul>
            </div>

            <div className="widget nav-widget">
              <ul>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">X(Twitter)</a>
                </li>
                <li>
                  <a href="#">FaceBook</a>
                </li>
                <li>
                  <a href="#">LinkedIn</a>
                </li>
                <li>
                  <a href="#">YouTube</a>
                </li>
              </ul>
            </div>

            <div className="widget nav-widget">
              <ul>
                <li>
                  <a href="mailto:info@givingback.org">info@givingback.org</a>
                </li>
                <li>
                  <a href="tel:+2349085494236">+2349085494236</a>
                </li>
                <li>
                  <a href="tel:+2349123456789">+2349123456789</a>
                </li>
                <li>
                  <a href="#">Muliner Towers, Alfred Rewane Rd.</a>
                </li>
                <li>
                  <a href="#">Ikoyi, Lagos</a>
                </li>
              </ul>
            </div>
            <div className="widget nav-widget">
              <ul>
                <li>
                  <a href="/terms">Terms & Conditions</a>
                </li>
                <li>
                  <a href="/policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/aml">Anti-Money Laundering</a>
                </li>
              </ul>
            </div>
          </div>
          <section className="d-flex justify-content-center align-items-center border-top">
            <div className="copyright-area">
              <div className="row">
                <p className="copyright-text">
                  © {new Date().getFullYear()} <a href="#">GivingBack</a>. All
                  Rights Reserved
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

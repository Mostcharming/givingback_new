import GiveBackLogo from '../../assets/images/home/GivingBackNG-logo.svg'

const Footer = ({ footerSolidBg }) => {
  return (
    <footer
      className={`site-footer ${
        footerSolidBg ? '' : 'with-footer-cta with-footer-bg'
      }`}
    >
      {!footerSolidBg && (
        <div className='footer-cta'>
          <div className='container'>
            <div className='row justify-content-lg-between justify-content-center align-items-center'>
              <div className='col-lg-7 col-md-8 col-sm-10'>
                <span className='cta-tagline'>
                  The World needs more goodness
                </span>
                <h3 className='cta-title'>Fund a project today!</h3>
              </div>
              <div className='col-lg-auto col-md-6'>
                <a
                  href='/auth/login'
                  className='main-btn bordered-btn bordered-white mt-md-30'
                >
                  Fund a project <i className='far fa-arrow-right' />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='footer-content-area'>
        <div className='container'>
          <div className='footer-widgets'>
            <div className='row justify-content-between'>
              <div className='col-xl-3 col-lg-4 col-md-6'>
                <div className='widget about-widget'>
                  <div className='footer-logo'>
                    <img src={GiveBackLogo} alt='GivingBack' />
                  </div>
                  <div className='newsletter-form'>
                    <h5 className='form-title'>Join Newsletters</h5>
                    <form onSubmit={(e) => e.preventDefault()} action='#'>
                      <input type='text' placeholder='Email Address' />
                      <button type='submit'>
                        <i className='far fa-arrow-right' />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className='col-lg-2 col-md-5 col-sm-6'>
                <div className='widget nav-widget'>
                  <h4 className='widget-title'>Our Projects</h4>
                  <ul>
                    <li>
                      <a href='/#'>Directory &amp; Smart Search</a>
                    </li>
                    <li>
                      <a href='/#'>Report &amp; Analytics</a>
                    </li>
                    <li>
                      <a href='/#'>Funds Management</a>
                    </li>
                    <li>
                      <a href='/#'>Brief &amp; Project Design</a>
                    </li>
                    <li>
                      <a href='/#'>Collaboration Tools</a>
                    </li>
                    <li>
                      <a href='/#'>Fund Raising</a>
                    </li>
                    <li>
                      <a href='/#'>Project Management Tools</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='col-lg-2 col-md-6 col-sm-6'>
                <div className='widget nav-widget'>
                  <h4 className='widget-title'>Support</h4>
                  <ul>
                    <li>
                      <a href='/about_us'>About us</a>
                    </li>
                    <li>
                      <a href='/services'>Our services</a>
                    </li>
                    <li>
                      <a href='/terms'>Terms &amp; Conditions</a>
                    </li>
                    <li>
                      <a href='/policy'>Privacy Policy</a>
                    </li>
                    <li>
                      <a href='/aml'>Anti-Money Laundering</a>
                    </li>
                    <li>
                      <a href='/contact'>Contact Us</a>
                    </li>
                    <li>
                      <a href='/#'>FAQs</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='col-lg-auto col-md-5 col-sm-8'>
                <div className='widget contact-widget'>
                  <h4 className='widget-title'>Contact Us</h4>
                  <ul className='info-list'>
                    <li>
                      <span className='icon'>
                        <i className='far fa-phone' />
                      </span>
                      <span className='info'>
                        <span className='info-title'>Phone Number</span>
                        <a href='tel:+2349085494236'>+234 908 549 4236</a>
                      </span>
                    </li>
                    <li>
                      <span className='icon'>
                        <i className='far fa-envelope-open' />
                      </span>
                      <span className='info'>
                        <span className='info-title'>Email Address</span>
                        <a href='mailto:info@givingbackng.org'>
                          info@givingbackng.org
                        </a>
                      </span>
                    </li>
                    <li>
                      <span className='icon'>
                        <i className='far fa-map-marker-alt' />
                      </span>
                      <span className='info'>
                        <span className='info-title'>Locations</span>
                        <div>
                          Muliner Towers, Alfred Rewane Rd. Ikoyi, Lagos
                        </div>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='copyright-area'>
            <div className='row flex-md-row-reverse'>
              <div className='col-md-6'>
                <ul className='social-icons'>
                  <li>
                    <a href='#'>
                      <i className='fab fa-facebook-f' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='fab fa-twitter' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='fab fa-youtube' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='fab fa-behance' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <i className='fab fa-google-plus-g' />
                    </a>
                  </li>
                </ul>
              </div>
              <div className='col-md-6'>
                <p className='copyright-text'>
                  © {new Date().getFullYear()} <a href='#'>GivingBack</a>. All
                  Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

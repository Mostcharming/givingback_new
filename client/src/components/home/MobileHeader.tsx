import { useState } from 'react'
import { Link } from 'react-router-dom'
// import DonateModal from '../componenets/modals/DonateModal'
import GiveBackLogo from '../../assets/images/home/GivingBackNG-logo.svg'
import { Project } from './menus'

const MobileHeader = ({
  transparentTop,
  transparentHeader,
  topSecondaryBg
}) => {
  const [toggle, setToggle] = useState(false)
  const [activeToggle, setActiveToggle] = useState('')
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)
  const setActive = (value) =>
      setActiveToggle(value === activeToggle ? '' : value),
    activeLi = (value) =>
      value === activeToggle ? { display: 'block' } : { display: 'none' },
    activeArrow = (value) => (value === activeToggle ? 'submenu-opened' : '')
  return (
    <>
      <header
        className={`site-header sticky-header  d-lg-none ${
          transparentTop ? 'topbar-transparent' : ''
        } ${transparentHeader ? 'transparent-header' : ''}`}
        id='header-sticky'
      >
        {/* <div
          className={`header-topbar d-none d-sm-block ${
            topSecondaryBg ? 'topbar-secondary-bg' : ''
          }`}
        >
          <div className='container'>
            <div className='row justify-content-between align-items-center'>
              <div className='col-auto'>
                <ul className='contact-info'>
                  <li>
                    <a href='mailto:info@givingbackng.org'>
                      <i className='far fa-envelope' /> info@givingbackng.org
                    </a>
                  </li>
                  <li>
                    <div>
                      <i className='far fa-map-marker-alt' /> Muliner Towers,
                      Alfred Rewane Rd. Ikoyi, Lagos
                    </div>
                  </li>
                </ul>
              </div>
              <div className='col-auto d-none d-md-block'>
                <ul className='social-icons'>
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
            </div>
          </div>
        </div> */}
        <div className='navbar-wrapper breakpoint-on'>
          <div className='container'>
            <div className='navbar-inner'>
              <div className='site-logo'>
                <Link to='/'>
                  <a>
                    <img src={GiveBackLogo} alt='GiveBackLogo' />
                  </a>
                </Link>
              </div>
              <div className='navbar-extra d-flex align-items-center cursor-pointer'>
                <a
                  className='main-btn nav-btn d-none d-sm-inline-block'
                  onClick={() => setIsDonateModalOpen(true)}
                >
                  Create Account
                  {/* <i className='far fa-arrow-right' /> */}
                </a>
                <a
                  href='#'
                  className={`nav-toggler ${toggle ? 'panel-opened' : ''}`}
                  onClick={() => setToggle(!toggle)}
                >
                  <span />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={`mobile-menu-panel ${toggle ? 'panel-opened' : ''}`}>
          <div className='panel-logo'>
            <Link to='/'>
              <a>
                <img src={GiveBackLogo} alt='Funden' />
              </a>
            </Link>
          </div>
          <ul className='panel-menu' id='menu'>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <a href='#'>
                Project
                <span
                  className={`dd-trigger ${activeArrow('Project')}`}
                  onClick={() => setActive('Project')}
                >
                  <i className='far fa-angle-down' />
                </span>
              </a>
              <ul className='submenu' style={activeLi('Project')}>
                {Project}
              </ul>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
          </ul>
          <div className='panel-extra'>
            <Link to='/auth/login' className='main-btn btn-white'>
              Sign in
              {/* <i className='far fa-arrow-right' /> */}
            </Link>
          </div>
          <div className='panel-extra mt-3'>
            <a
              href='auth/register'
              className='main-btn btn-white'
              onClick={() => setIsDonateModalOpen(true)}
            >
              Create Account
              {/* <i className='far fa-arrow-right' /> */}
            </a>
          </div>
          <a href='#' className='panel-close' onClick={() => setToggle(false)}>
            <i className='fal fa-times' />
          </a>
        </div>
      </header>
      {/* <DonateModal
        open={isDonateModalOpen}
        handleClose={() => setIsDonateModalOpen(false)}
      /> */}
    </>
  )
}

export default MobileHeader

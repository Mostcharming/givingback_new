// @ts-ignore

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GiveBackLogo from '../../assets/images/home/GivingBackNG-logo.svg'
// import DonateModal from '../componenets/modals/DonateModal'
import { stickyNav } from './util'

const Header = ({ transparentTop, transparentHeader, topSecondaryBg }) => {
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false)
  useEffect(() => {
    window.addEventListener('scroll', stickyNav)
  })
  return (
    <>
      <header
        className={`site-header sticky-header d-none d-lg-block ${
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
                  <li className='bg-white p-1 pl-3 pr-3 rounded'>
                    <Link style={{ color: 'black' }} to={'/auth/login'}>
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
        <div className='navbar-wrapper'>
          <div className='container'>
            <div className='d-flex'>
              <div className='site-logo mr-4'>
                <Link to='/'>
                  <a>
                    <img src={GiveBackLogo} alt='GivingBack' />
                  </a>
                </Link>
              </div>

              <div className='ml-3 navbar-extra d-flex align-items-center'>
                <div className='nav-menu pr-4' id='menu'>
                  <ul>
                    <li>
                      <Link to='/'>Home</Link>
                    </li>
                    <li>
                      <Link to='/about_us'>About us</Link>
                    </li>
                    <li>
                      <Link to='/services'>Services</Link>
                    </li>

                    <li>
                      <Link to='/latest-projects'>Project</Link>
                    </li>
                    <li>
                      <Link to='/contact'>Contact</Link>
                    </li>
                  </ul>
                </div>

                <a href='#' className='nav-toggler'>
                  <span />
                </a>
              </div>
              <div className='d-flex align-items-center ml-auto'>
                <a
                  href='/auth/register'
                  className='mr-3 main-btn nav-btn d-none d-sm-inline-block cursor-pointer'
                  onClick={() => setIsDonateModalOpen(true)}
                  style={{ backgroundColor: '#F3FAF5', color: '#34A853' }}
                >
                  Sign in
                  {/* <i className='far fa-arrow-right' /> */}
                </a>
                <a
                  href='/auth/register'
                  className='main-btn nav-btn d-none d-sm-inline-block cursor-pointer'
                  onClick={() => setIsDonateModalOpen(true)}
                >
                  Create Account
                  {/* <i className='far fa-arrow-right' /> */}
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
  )
}

export default Header

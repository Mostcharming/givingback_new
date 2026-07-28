import { Link } from 'react-router-dom'
import {
  Col,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row,
  UncontrolledCollapse
} from 'reactstrap'
import Logo from '../../assets/images/home/GivingBackNG-logo.svg'

const AuthNavbar = ({ sign }) => {
  return (
    <>
      <Navbar
        style={{ height: '40px' }}
        className='navbar-top p-4 navbar-horizontal navbar-dark'
        expand='md'
      >
        <Container className='px-2'>
          <NavbarBrand to='/' tag={Link}>
            <img alt='...' src={Logo} style={{ height: '80px' }} />
          </NavbarBrand>
          <button className='navbar-toggler' id='navbar-collapse-main'>
            <span className='navbar-toggler-icon' />
          </button>
          <UncontrolledCollapse navbar toggler='#navbar-collapse-main'>
            <div className='navbar-collapse-header d-md-none'>
              <Row>
                <Col className='collapse-brand' xs='6'>
                  <Link to='/'>
                    <img alt='...' src={Logo} style={{ height: '80px' }} />
                  </Link>
                </Col>
                <Col className='collapse-close' xs='6'>
                  <button className='navbar-toggler' id='navbar-collapse-main'>
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            {!sign && (
              <Nav className='ml-auto' navbar>
                <NavItem>
                  <NavLink
                    className='nav-link-icon'
                    to='/auth/register'
                    tag={Link}
                  >
                    <i className='ni ni-circle-08' style={{ color: 'black' }} />
                    <span
                      style={{ color: 'black' }}
                      className='nav-link-inner--text'
                    >
                      Register
                    </span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className='nav-link-icon'
                    to='/auth/login'
                    tag={Link}
                  >
                    <i className='ni ni-key-25' style={{ color: 'black' }} />
                    <span
                      style={{ color: 'black' }}
                      className='nav-link-inner--text'
                    >
                      Login
                    </span>
                  </NavLink>
                </NavItem>
              </Nav>
            )}
          </UncontrolledCollapse>
        </Container>
      </Navbar>
    </>
  )
}

export default AuthNavbar

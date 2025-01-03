import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'

import NotFound from '../assets/images/error/not_found.png'
import logo from '../assets/images/logo.png'

const Error = () => {
  ;(document.body as HTMLElement).style.height = '100%'
  ;(document.body as HTMLElement).style.backgroundColor = 'white'

  return (
    <div>
      <Navbar bg='white' expand='lg'>
        <Container>
          <Nav.Link as={Link} to='/'>
            <img src={logo} alt='Logo' />
          </Nav.Link>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
        </Container>
      </Navbar>
      <Container className='mt-5'>
        <div
          className='text-center'
          style={{ maxWidth: '800px', marginRight: 'auto', marginLeft: 'auto' }}
        >
          <img
            src={NotFound}
            style={{ maxWidth: '500px', maxHeight: '500px' }}
            className='img-fluid'
          />
        </div>
      </Container>
    </div>
  )
}
export default Error

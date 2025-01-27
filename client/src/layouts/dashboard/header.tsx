import { useNavigate } from 'react-router-dom'
// reactstrap components
import { useDispatch } from 'react-redux'
import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Media,
  Nav,
  Navbar,
  UncontrolledDropdown
} from 'reactstrap'
import { ThunkDispatch } from 'redux-thunk'
import useBackendService from '../../services/backend_service'
import { useContent } from '../../services/useContext'
import { logout_auth } from '../../store/reducers/authReducer'
import { RootState } from '../../types'

const AdminNavbar: React.FC<any> = (props) => {
  const { currentState } = useContent()
  const navigate = useNavigate()
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch()

  const { mutate: logout } = useBackendService('/auth/logout', 'GET', {
    onSuccess: () => {
      dispatch(logout_auth())
      navigate('/')
    },
    onError: () => {}
  })

  const getCurrentRoute = () => {
    const path = location.pathname

    if (path.endsWith('/dashboard')) return 'DASHBOARD'
    if (path.endsWith('/ngo_directory')) return 'NGO DIRECTORY'
    if (path.endsWith('/add_past')) return 'ADD PAST PROJECT'
    if (path.endsWith('/fund_management')) return 'FUND MANAGEMENT'
    if (path.endsWith('/fund_wallet')) return 'FUND WALLET'
    if (path.endsWith('/send_money')) return 'SEND MONEY'
    if (path.includes('/briefs')) return 'BRIEFS'
    if (path.includes('/brief_initiate')) return 'CREATE BRIEF'

    // Check if the path matches "/ngo/<number>"
    const ngoDetailsMatch = path.match(/\/ngo\/\d+$/)
    if (ngoDetailsMatch) return 'NGO DETAILS'
    const projectDetailsMatch = path.match(/\/project\/\d+$/)
    if (projectDetailsMatch) return 'PROJECT DETAILS'

    return path.split('/').pop()?.toUpperCase() || 'HOME'
  }

  return (
    <>
      <Navbar
        style={{ height: '10px', marginBottom: '70px' }}
        className='navbar-top navbar-dark'
        expand='md'
        id='navbar-main'
      >
        <Container style={{ marginTop: '50px' }} fluid>
          <p style={{ fontWeight: 'bold' }}>{getCurrentRoute()}</p>
          <Form className='navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto'>
            <FormGroup className='mb-0'></FormGroup>
          </Form>
          <Nav className='align-items-center d-none d-md-flex' navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className='pr-0' nav>
                <Media className='align-items-center'>
                  <span className='avatar avatar-sm rounded-circle'>
                    <img alt='...' src={currentState.userimage?.filename} />
                  </span>
                  <Media className='ml-2 d-none d-lg-block'>
                    <span
                      style={{ color: 'black' }}
                      className='mb-0 text-sm font-weight-bold'
                    >
                      {currentState.user?.name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className='dropdown-menu-arrow' right>
                <DropdownItem className='noti-title' header tag='div'>
                  <h6 className='text-overflow m-0'>Welcome!</h6>
                </DropdownItem>

                <DropdownItem divider />
                <DropdownItem
                  href='#pablo'
                  onClick={(e) => {
                    e.preventDefault()
                    logout({})
                  }}
                >
                  <i className='ni ni-user-run' />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}

export default AdminNavbar

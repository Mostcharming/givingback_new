import { Link, useNavigate } from 'react-router-dom'
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
  return (
    <>
      <Navbar className='navbar-top navbar-dark' expand='md' id='navbar-main'>
        <Container fluid>
          <Form className='navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto'>
            <FormGroup className='mb-0'>
              {/* <InputGroup className='input-group-alternative'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='fas fa-search' /> 
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder='Search' type='text' />
              </InputGroup> */}
            </FormGroup>
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
                <DropdownItem to='/admin/user-profile' tag={Link}>
                  <i className='ni ni-single-02' />
                  <span>Profile</span>
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

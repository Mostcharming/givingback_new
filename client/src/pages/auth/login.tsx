import { ThunkDispatch } from '@reduxjs/toolkit'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'
import google from '../../assets/images/auth/google.svg'
import useBackendService from '../../services/backend_service'
import firebaseApp from '../../services/firebase'
import {
  clearAuthState,
  login_auth,
  logout_auth
} from '../../store/reducers/authReducer'
import { clearCurrentState } from '../../store/reducers/userReducer'
import { RootState } from '../../types'

const Login = () => {
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch()
  const navigate = useNavigate()

  const { mutate: logout } = useBackendService('/auth/logout', 'GET', {
    onSuccess: () => {
      dispatch(logout_auth())
      dispatch(clearAuthState())

      // Clear current state
      dispatch(clearCurrentState())
    },
    onError: () => {}
  })
  const { mutate: login, isLoading } = useBackendService(
    '/auth/login',
    'POST',
    {
      onSuccess: (response: any) => {
        toast.success('Logged in successfully')
        dispatch(login_auth(response))
        navigate('/dashboard')
      },
      onError: (error: any) => {
        toast.error(error.response.data.error)
      }
    }
  )

  useEffect(() => {
    logout({})
  }, [dispatch])

  const provider = new GoogleAuthProvider()
  const auth = getAuth(firebaseApp)

  const withGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const email = result.user.email!
        const password = ''
        const uuid = 'giveback'
        login({ email, password, uuid })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement)
      .value
    const uuid = ''
    login({ email, password, uuid })
  }

  return (
    <>
      <Col lg='5' md='7'>
        <Card className='shadow border-0'>
          <CardHeader className='bg-transparent pb-3'>
            <div className='text-muted text-center mt-2 mb-3'>
              <small>Sign in with</small>
            </div>
            <div className='btn-wrapper text-center'>
              <Button
                className='btn-neutral btn-icon'
                color='default'
                onClick={withGoogle}
              >
                <span className='btn-inner--icon'>
                  <img src={google} alt='Google Sign-In' />
                </span>
                <span className='btn-inner--text'>Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className='px-lg-3 py-lg-3'>
            <div className='text-center text-muted mb-4'>
              <small>Or sign in with credentials</small>
            </div>
            <Form role='form' onSubmit={handleSubmit}>
              <FormGroup className='mb-3'>
                <InputGroup className='input-group-alternative'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-email-83' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className='pl-2'
                    placeholder='Email'
                    type='email'
                    name='email'
                    autoComplete='new-email'
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className='input-group-alternative'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-lock-circle-open' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className='pl-2'
                    placeholder='Password'
                    type='password'
                    name='password'
                    autoComplete='new-password'
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className='custom-control custom-control-alternative custom-checkbox'>
                <input
                  className='custom-control-input'
                  id='customCheckLogin'
                  type='checkbox'
                />
                <label
                  className='custom-control-label'
                  htmlFor='customCheckLogin'
                >
                  <span className='text-muted'>Remember me</span>
                </label>
              </div>
              <div className='text-center'>
                <Button
                  className='my-4'
                  style={{ background: '#5e72e4' }}
                  type='submit'
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className='mt-3'>
          <Col xs='6'>
            <Link to='/auth/forgot_password'>
              <small style={{ color: 'black' }}>Forgot password?</small>
            </Link>
          </Col>
          <Col className='text-right' xs='6'>
            <Link to='/auth/register'>
              <small style={{ color: 'black' }}>Create new account</small>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  )
}

export default Login

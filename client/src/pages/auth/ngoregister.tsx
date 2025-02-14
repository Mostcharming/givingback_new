import { ThunkDispatch } from '@reduxjs/toolkit'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { FaHandHoldingHeart, FaHandsHelping } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'
import google from '../../assets/images/auth/google.svg'
import useBackendService from '../../services/backend_service'
import firebaseApp from '../../services/firebase'
import { clearAuthState, signup_auth } from '../../store/reducers/authReducer'
import { clearCurrentState } from '../../store/reducers/userReducer'
import { RootState } from '../../types'

const Register = () => {
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(true)
  const handleRoleSelection = (role) => {
    setIsDonor(role === 'donor')
    setModalOpen(false)
  }

  const { mutate: signup, isLoading } = useBackendService(
    '/auth/signup',
    'POST',
    {
      onSuccess: (response: any) => {
        toast.success('Signed up successfully')
        dispatch(signup_auth(response))
        navigate('/dashboard')
      },
      onError: (error: any) => {
        toast.error(error.response.data.error)
      }
    }
  )
  useEffect(() => {
    dispatch(clearAuthState())

    // Clear current state
    dispatch(clearCurrentState())
  }, [])

  const provider = new GoogleAuthProvider()
  const auth = getAuth(firebaseApp)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Select one')

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState)

  const handleDropdownSelect = (option: string) => {
    setSelectedOption(option)
  }

  const [isDonor, setIsDonor] = useState(false)

  const toggleRole = () => {
    setIsDonor((prev) => !prev)
  }

  const calculatePasswordStrength = (password: string) => {
    if (!password) return ''
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /[0-9]/.test(password)
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const lengthCheck = password.length >= 8

    const strength =
      Number(lengthCheck) +
      Number(hasUpperCase) +
      Number(hasLowerCase) +
      Number(hasNumbers) +
      Number(hasSpecialChars)

    if (strength === 5) return 'Strong'
    if (strength >= 3) return 'Medium'
    return 'Weak'
  }

  const withGoogle = () => {
    let uuid
    if (isDonor) {
      uuid = selectedOption === 'Corporate' ? 'corporate' : 'donor'
    } else {
      uuid = 'giveback'
    }
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const email = result.user.email!
        const password = ''
        signup({ email, password, uuid })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setPasswordStrength(calculatePasswordStrength(value))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let uuid

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (passwordStrength === 'Weak') {
      setPasswordError('Please use a stronger password')
      return
    }
    if (isDonor && selectedOption === 'Select one') {
      setPasswordError('Please select a donor type')
      return
    }

    setPasswordError('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value

    if (isDonor) {
      uuid = selectedOption === 'Corporate' ? 'corporate' : 'donor'
    }
    const data = { email, password, uuid }

    signup(data)
  }

  return (
    <>
      <Modal isOpen={modalOpen} backdrop='static' centered>
        <ModalHeader
          className='text-black'
          style={{ backgroundColor: 'white' }}
        >
          Choose Registration Type
        </ModalHeader>
        <ModalBody
          className='text-center'
          style={{
            backgroundColor: 'white',
            color: 'black',
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >
          <div
            color='light'
            style={{ cursor: 'pointer' }}
            onClick={() => handleRoleSelection('ngo')}
          >
            <FaHandsHelping size={60} color='black' />
            <div>NGO</div>
          </div>
          <div
            color='light'
            style={{ cursor: 'pointer' }}
            onClick={() => handleRoleSelection('donor')}
          >
            <FaHandHoldingHeart size={60} color='black' />
            <div>Donor</div>
          </div>
        </ModalBody>
        <ModalFooter style={{ backgroundColor: 'white' }}>
          Back to
          <Button color='light' onClick={() => navigate('/auth/login')}>
            Login
          </Button>
        </ModalFooter>
      </Modal>

      <Col lg='6' md='8'>
        <Card className='shadow border-0'>
          <CardHeader className='bg-transparent pb-3'>
            <div className='text-muted text-center mt-2 mb-4'>
              <small>Sign up with</small>
            </div>
            <div className='text-center'>
              <Button
                className='btn-neutral btn-icon'
                color='default'
                onClick={withGoogle}
              >
                <span className='btn-inner--icon'>
                  <img alt='...' src={google} />
                </span>
                <span className='btn-inner--text'>Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className='px-lg-3 py-lg-3'>
            <div className='text-center text-muted mb-4'>
              <small>Or sign up with credentials</small>
            </div>
            <Form role='form' onSubmit={handleSubmit}>
              {isDonor && (
                <FormGroup>
                  <Label for='donorType'>Which best describes you?</Label>
                  <InputGroup className='input-group-alternative mb-3'>
                    <Dropdown
                      isOpen={dropdownOpen}
                      toggle={toggleDropdown}
                      className='w-100'
                    >
                      <DropdownToggle
                        caret
                        color='secondary'
                        className='w-100 text-start'
                      >
                        {selectedOption}
                      </DropdownToggle>
                      <DropdownMenu className='w-100'>
                        <DropdownItem
                          onClick={() => handleDropdownSelect('Individual')}
                        >
                          Individual
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => handleDropdownSelect('Corporate')}
                        >
                          Corporate
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </InputGroup>
                </FormGroup>
              )}

              <FormGroup>
                <InputGroup className='input-group-alternative mb-3'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-email-83' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className='pl-2'
                    placeholder='Email'
                    type='email'
                    autoComplete='new-email'
                    name='email'
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className='input-group-alternative mb-3'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-lock-circle-open' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className='pl-2'
                    placeholder='Password'
                    type='password'
                    autoComplete='new-password'
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className='input-group-alternative mb-3'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-lock-circle-open' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className='pl-2'
                    placeholder='Confirm Password'
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className='text-muted font-italic mb-2'>
                <small>
                  Password strength:{' '}
                  <span
                    className={`font-weight-700 ${
                      passwordStrength === 'Strong'
                        ? 'text-success'
                        : passwordStrength === 'Medium'
                        ? 'text-warning'
                        : 'text-danger'
                    }`}
                  >
                    {passwordStrength || 'N/A'}
                  </span>
                </small>
              </div>
              {passwordError && (
                <div className='text-danger font-italic'>
                  <small>{passwordError}</small>
                </div>
              )}
              <div className='text-center'>
                <Button
                  className='mt-4'
                  style={{ background: '#5e72e4' }}
                  type='submit'
                  disabled={isLoading}
                >
                  Create account
                </Button>
              </div>
            </Form>
            <div className='text-center mt-3'>
              <Button color='link' onClick={toggleRole}>
                <small style={{ color: 'black' }}>
                  {isDonor ? 'or sign up as an NGO' : 'or sign up as a Donor'}
                </small>
              </Button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  )
}

export default Register

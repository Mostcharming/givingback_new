import { ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'
import useBackendService from '../../services/backend_service'
import { RootState } from '../../types'

const ForgotPassword = () => {
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch()
  const navigate = useNavigate()

  const { mutate: forgotPassword, isLoading } = useBackendService(
    '/auth/forgotpassword',
    'POST',
    {
      onSuccess: () => {
        toast.success('Password reset email sent successfully')
        navigate('/auth/login')
      },
      onError: (error: any) => {
        toast.error(error.response.data.error)
      }
    }
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    forgotPassword({ email })
  }

  return (
    <>
      <Col lg='5' md='7'>
        <Card className='shadow border-0'>
          <CardBody className='px-lg-5 py-lg-5'>
            <div className='text-center text-muted mb-4'>
              <small>Enter your email to reset your password</small>
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
                    placeholder='Email'
                    type='email'
                    name='email'
                    autoComplete='new-email'
                    required
                  />
                </InputGroup>
              </FormGroup>
              <div className='text-center'>
                <Button
                  className='my-4'
                  style={{ background: '#5e72e4' }}
                  type='submit'
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className='mt-3'>
          <Col xs='6'>
            <Link to='/auth/login'>
              <small style={{ color: 'black' }}>Back to Login</small>
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

export default ForgotPassword

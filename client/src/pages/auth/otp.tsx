import { ThunkDispatch } from '@reduxjs/toolkit'
import { useState } from 'react'
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
  Row
} from 'reactstrap'
import useBackendService from '../../services/backend_service'
import { update_user_status } from '../../store/reducers/authReducer'
import { RootState } from '../../types'

const OtpVerification = () => {
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch()

  const [otp, setOtp] = useState<string>('')
  const navigate = useNavigate()

  const { mutate: verifyOtp, isLoading } = useBackendService(
    '/auth/verify',
    'POST',
    {
      onSuccess: () => {
        toast.success('OTP verified successfully')
        dispatch(update_user_status())
        navigate('/dashboard')
      },
      onError: (error: any) => {
        toast.error(error.response.data.error)
      }
    }
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value
    if (value.match(/[^0-9]/)) return // Prevent non-numeric values
    const otpArr = otp.split('')
    otpArr[index] = value
    setOtp(otpArr.join(''))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    verifyOtp({ otp })
  }

  return (
    <Col lg='5' md='7'>
      <Card className='shadow border-0'>
        <CardBody className='px-lg-5 py-lg-5'>
          <div className='text-center text-muted mb-4'>
            <small>Enter the 6-digit OTP sent to your email</small>
          </div>
          <Form role='form' onSubmit={handleSubmit}>
            <FormGroup className='mb-3'>
              <div className='d-flex justify-content-center'>
                {[...Array(6)].map((_, index) => (
                  <Input
                    key={index}
                    type='text'
                    maxLength={1}
                    value={otp[index] || ''}
                    onChange={(e) => handleChange(e, index)}
                    style={{
                      width: '50px',
                      height: '50px',
                      margin: '0 5px',
                      textAlign: 'center',
                      fontSize: '18px'
                    }}
                    required
                  />
                ))}
              </div>
            </FormGroup>
            <div className='text-center'>
              <Button
                className='my-4'
                style={{ background: '#5e72e4' }}
                type='submit'
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
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
          {/* <Link to='/auth/forgotpassword'>
            <small style={{ color: 'black' }}>Resend OTP</small>
          </Link> */}
        </Col>
      </Row>
    </Col>
  )
}

export default OtpVerification

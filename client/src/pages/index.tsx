import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Col, Container, Row } from 'reactstrap'

import Loading from '../components/home/loading'
import useBackendService from '../services/backend_service'
import { useContent } from '../services/useContext'
import './index.css'

function FundWallets() {
  const { currentState, authState } = useContent()
  const [loading, setLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const navigate = useNavigate()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paystackPublicKey, setPaystackPublicKey] = useState<string | null>(
    null
  )
  const [stripe, setStripe] = useState<string | null>(null)

  const handleCountrySelect = (country: string) => setSelectedCountry(country)
  const { mutate: paymentGateways } = useBackendService(
    '/admin/payment-gateways',
    'GET',
    {
      onSuccess: (res2: any) => {
        const paystackGateway = res2.find(
          (gateway: any) => gateway.name.toLowerCase() === 'paystack'
        )
        if (paystackGateway && paystackGateway.public_key) {
          setPaystackPublicKey(paystackGateway.public_key)
        } else {
          toast.error('Paystack configuration not found.')
        }
        const stripe = res2.find(
          (gateway: any) => gateway.name.toLowerCase() === 'stripe'
        )
        if (stripe && stripe.public_key) {
          setStripe(stripe.public_key)
        } else {
          toast.error('Stripe configuration not found.')
        }
      },
      onError: () => {}
    }
  )
  const { mutate: fundPost } = useBackendService('/fund', 'POST', {
    onSuccess: (res2: any) => {},
    onError: () => {}
  })
  useEffect(() => {
    paymentGateways({})
  }, [])

  const handleNigerianPay = () => {
    const paymentData = {
      email: currentState.user.email,
      amount: parseFloat(amount) * 100, // Amount in kobo
      reference: Date.now().toString(), // Unique reference
      currency: 'NGN'
    }

    const paystack = (window as any).PaystackPop.setup({
      key: paystackPublicKey,
      email: paymentData.email,
      amount: paymentData.amount,
      currency: paymentData.currency,
      reference: paymentData.reference,
      callback: function (response: any) {
        setLoading(false)
        toast.success('Payment successful!')

        const paymentDetails = {
          user_id: authState.user.id,
          payment_gateway: 'Paystack',
          transactionId: response.reference,
          status: response.status,
          currency: paymentData.currency,
          amount: parseFloat(amount)
        }

        // Send payment details to the backend for verification and storage
        // verifyAndStorePayment(paymentDetails)
        fundPost(paymentDetails)
      },
      onClose: function () {
        setLoading(false)
        toast.error('Payment was canceled.')
      }
    })

    paystack.openIframe()
  }

  const handlePayNow = async () => {
    setLoading(true)

    handleNigerianPay()
  }

  const stripePromise = loadStripe(stripe)
  const parsedAmount = parseFloat(amount) * 100
  const isAmountValid = !isNaN(parsedAmount) && parsedAmount > 0

  const fund = () => {
    if (authState.user.role === 'NGO') {
      navigate('/ngo/fund_wallet')
    } else {
      navigate('/donor/fund_wallet')
    }
  }
  const send = () => {
    if (authState.user.role === 'NGO') {
      navigate('/ngo/send_money')
    } else {
      navigate('/donor/send_money')
    }
  }

  return (
    <>
      {loading && <Loading type={'full'} />}
      <Container fluid>
        <Header fund={fund} send={send} />
        {!selectedCountry && (
          <CountrySelection
            selectedCountry={selectedCountry}
            handleCountrySelect={handleCountrySelect}
          />
        )}
        {selectedCountry === 'Other Countries' && (
          <Elements
            stripe={stripePromise}
            options={{
              mode: 'payment' as 'payment',
              amount: isAmountValid ? parsedAmount : 100,
              currency: 'usd',
              appearance: { theme: 'stripe' }
            }}
          >
            <PaymentForm2
              userId={authState.user.id}
              amount={amount}
              setAmount={setAmount}
              clientSecret={clientSecret}
              setClientSecret={setClientSecret}
            />
          </Elements>
        )}

        {selectedCountry === 'Nigeria' && (
          <PaymentForm
            amount={amount}
            setAmount={setAmount}
            handlePayNow={handlePayNow}
          />
        )}
      </Container>
    </>
  )
}

const Header = ({ fund, send }) => (
  <>
    <div style={{ borderBottom: '2px solid grey', margin: '10px 0' }} />
  </>
)

const CountrySelection = ({
  selectedCountry,
  handleCountrySelect
}: {
  selectedCountry: string | null
  handleCountrySelect: (country: string) => void
}) => (
  <Row className='' style={styles.countryOptions}>
    <Col>
      {!selectedCountry ? (
        <CountryOptions onSelectCountry={handleCountrySelect} />
      ) : null}
    </Col>
  </Row>
)

const CountryOptions = ({
  onSelectCountry
}: {
  onSelectCountry: (country: string) => void
}) => (
  <div style={styles.countryOptions}>
    <h3 style={styles.title}>Funding from...</h3>
    <Row>
      <CountryOption
        name='Nigeria'
        imgSrc='/nigeria.png'
        onSelect={() => onSelectCountry('Nigeria')}
      />
      <CountryOption
        name='Other Countries'
        imgSrc='/other.png'
        onSelect={() => onSelectCountry('Other Countries')}
      />
    </Row>
  </div>
)

const CountryOption = ({
  name,
  imgSrc,
  onSelect
}: {
  name: string
  imgSrc: string
  onSelect: () => void
}) => {
  const isOtherCountries = name === 'Other Countries'
  const imgSize = isOtherCountries ? 148 : 102
  const pad = isOtherCountries ? '' : 'p-4'

  return (
    <Col className='text-center'>
      <div className={pad} onClick={onSelect} style={{ cursor: 'pointer' }}>
        <img src={imgSrc} alt={name} width={imgSize} height={imgSize} />
      </div>
      <p style={styles.optionText}>{name}</p>
    </Col>
  )
}

const PaymentForm = ({
  amount,
  setAmount,
  handlePayNow
}: {
  amount: string
  setAmount: (value: string) => void
  handlePayNow: () => void
}) => {
  const handleSubmit = () => {
    handlePayNow()
  }

  return (
    <div className='col-lg-6 mx-auto'>
      <div className='card'>
        <div className='card-header'>
          <div className='form-group'>
            <h6>Amount</h6>
            <input
              type='number'
              required
              className='form-control'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button
            type='button'
            className='btn btn-block '
            style={styles.paymentButton}
            onClick={handleSubmit}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  )
}

const PaymentForm2 = ({
  userId,
  amount,
  setAmount,
  clientSecret,
  setClientSecret
}: {
  userId: number
  amount: string
  clientSecret: string | null
  setAmount: (value: string) => void
  setClientSecret: (value: string) => void
}) => {
  const stripe = useStripe()
  const elements = useElements()

  const { mutate: stripeS } = useBackendService('/stripe_session', 'POST', {
    onSuccess: (res2: any) => {
      setClientSecret(res2.clientSecret)
    },
    onError: () => {}
  })
  const { mutate: fundPost } = useBackendService('/fund', 'POST', {
    onSuccess: (res2: any) => {},
    onError: () => {}
  })

  const handleStripePayment = async () => {
    if (!stripe || !elements) return

    stripeS({ amount: +amount * 100, currency: 'usd' })

    const { error: submitError } = await elements.submit()
    if (submitError) {
      toast.error('Payment failed: ')
      return
    }

    const cardElement = elements.getElement(CardElement)
    stripe.createPaymentMethod({
      type: 'card',
      card: cardElement
    })
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement
        }
      }
    )

    // const { error, paymentIntent } = await stripe.confirmPayment({
    //   elements,
    //   clientSecret,
    //   confirmParams: {
    //     return_url: `${window.location.origin}/dashboard`
    //   }
    // })

    if (error) {
      toast.error('Payment failed ')
    } else {
      if (paymentIntent?.status === 'succeeded') {
        const data = {
          user_id: userId,
          payment_gateway: 'Stripe',
          transactionId: paymentIntent.id,
          status: 'Success',
          currency: paymentIntent.currency,
          amount: amount
        }
        fundPost(data)
        toast.success('Payment successful!')
      }
    }
  }

  const handleSubmit = () => {
    handleStripePayment()
  }

  return (
    <div className='col-lg-6 mx-auto'>
      <div className='card'>
        <div className='card-header'>
          <div className='form-group'>
            <h6>Amount</h6>
            <input
              type='number'
              required
              className='form-control'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button
            type='button'
            className='btn btn-block '
            style={styles.paymentButton}
            onClick={handleSubmit}
          >
            Confirm Payment
          </button>
          {clientSecret && (
            <>
              {/* <PaymentElement
                id='payment-element'
                options={{
                  layout: 'tabs'
                }}
              /> */}
              <CardElement
                options={{
                  style: {
                    base: {
                      color: '#32325d',
                      fontFamily: 'Arial, sans-serif',
                      fontSmoothing: 'antialiased',
                      fontSize: '16px',
                      '::placeholder': {
                        color: '#32325d'
                      }
                    },
                    invalid: {
                      fontFamily: 'Arial, sans-serif',
                      color: '#fa755a',
                      iconColor: '#fa755a'
                    }
                  }
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  countryOptions: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: '5px',
    padding: '10px 15px',
    textAlign: 'center' as 'center'
  },
  title: {
    color: 'black',
    fontWeight: '100'
  },
  optionText: {
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: '600'
  },
  paymentButton: {
    backgroundColor: '#7B80DD',
    color: '#fff'
  }
}

export default FundWallets

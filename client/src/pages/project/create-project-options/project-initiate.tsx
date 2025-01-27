import { useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import Loading from '../../../components/home/loading'
import useBackendService from '../../../services/backend_service'
import { useContent } from '../../../services/useContext'
import ProgressHeader from '../../ngo/progress-header'
import SuccessModal from '../../SuccessModal'
import { useBriefContext } from '../add-brief-context'

const ProjectInitiate = ({ page, headers, changePage, donor = null }) => {
  const { authState, currentState } = useContent()
  const { brief, addToBrief, executingNGOs } = useBriefContext()
  const navigate = useNavigate()
  const [funds, setFunds] = useState<{ ngo_id: string; amount: number }[]>([])
  const [formattedFunds, setFormattedFunds] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFundsInputChange = (event, ngo_id) => {
    const amount = event.target.value

    formatAmountToDisplay(amount)

    const index = funds.findIndex((fund) => fund.ngo_id === ngo_id)

    if (index !== -1) {
      setFunds((prevFunds) => {
        const updatedFunds = [...prevFunds]
        updatedFunds[index] = { ngo_id, amount }
        return updatedFunds
      })
    } else {
      setFunds((prevFunds) => [...prevFunds, { ngo_id, amount }])
    }
  }

  const formatAmountToDisplay = (amount: string) => {
    const formatted = amount
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    setFormattedFunds(formatted)
  }

  const { mutate: donors } = useBackendService('/donor/projects', 'POST', {
    onSuccess: (res2: any) => {
      setIsLoading(false)
      setIsModalOpen(true)
    },
    onError: (error: any) => {
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  })
  const { mutate: admin } = useBackendService('/admin/projects', 'POST', {
    onSuccess: (res2: any) => {
      setIsLoading(false)
      setIsModalOpen(true)
    },
    onError: (error: any) => {
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (funds.length === 0) {
      toast.error('You must fund at least one NGO before proceeding.')
      return
    }

    const fundsBrief = {}
    e.preventDefault()
    for (let i = 0; i < funds.length; i++) {
      const ngoId = funds[i].ngo_id
      const amount = funds[i].amount.toString().replace(/,/g, '')

      const ngoIdKey = `funds[${i}][ngo_id]`
      const amountKey = `funds[${i}][amount]`

      fundsBrief[ngoIdKey] = ngoId
      fundsBrief[amountKey] = amount
    }

    setIsLoading(true)

    const formData = new FormData()

    // Append fields from the brief object
    Object.entries(brief).forEach(([key, value]) => {
      formData.append(key, value as string)
    })

    // Append fields from the fundsBrief
    funds.forEach((fund, index) => {
      formData.append(`funds[${index}][ngo_id]`, fund.ngo_id)
      formData.append(
        `funds[${index}][amount]`,
        fund.amount.toString().replace(/,/g, '')
      )
    })
    if (
      authState.user.role === 'donor' ||
      authState.user.role === 'corporate'
    ) {
      //     ...brief,
      //     ...fundsBrief

      donors(formData)
    } else {
      admin(formData)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (
      authState.user.role === 'donor' ||
      authState.user.role === 'corporate'
    ) {
      navigate('/donor/briefs')
    } else {
      navigate('/admin/briefs')
    }
  }

  return (
    <>
      <Container className='mt-3 admin-container w-75'>
        <ProgressHeader page={page} headers={headers} />

        <Form className='mt-5 mx-5' id='form' onSubmit={handleSubmit}>
          <Row>
            <Col lg='7'>
              <h6>Executing NGOs</h6>
              {executingNGOs.map((ngo) => (
                <Form.Group
                  key={ngo.id}
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                >
                  <Form.Control
                    type='text'
                    defaultValue={ngo.name}
                    disabled={true}
                  />
                </Form.Group>
              ))}
            </Col>
            <Col lg='5'>
              <h6>Allocated Funds</h6>
              {executingNGOs.map((ngo) => (
                <Form.Group
                  key={ngo.id}
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                >
                  <Form.Control
                    type='text'
                    onChange={(e) => handleFundsInputChange(e, ngo.id)}
                    required
                  />
                </Form.Group>
              ))}
            </Col>
          </Row>
          <Row>
            <Col lg='6'>
              <button
                type='button'
                className='btn-modal-back mb-5'
                onClick={() => changePage('Back')}
              >
                Back to Beneficiaries
              </button>
            </Col>
            <Col lg='6'>
              <button className='btn-modal mb-5'>Initiate Brief</button>
            </Col>
          </Row>
        </Form>
      </Container>

      <SuccessModal
        open={isModalOpen}
        handleClose={handleClose}
        message={
          <>
            <p className='mb-0 fw-normal'>Your project has been</p>
            <p className='mb-2'>successfully initiated.</p>{' '}
          </>
        }
      />
      {isLoading && <Loading type={'full'} />}
    </>
  )
}
export default ProjectInitiate

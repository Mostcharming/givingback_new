import { useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import Loading from '../../../components/home/loading'
import ProgressHeader from '../../ngo/progress-header'
import SuccessModal from '../../SuccessModal'
import { useBriefContext } from '../add-brief-context'

const ProjectInitiate = ({ page, headers, changePage, donor = null }) => {
  const { brief, addToBrief, executingNGOs } = useBriefContext()
  const navigate = useNavigate()
  const [funds, setFunds] = useState<{ ngo_id: string; amount: number }[]>([])
  const [formattedFunds, setFormattedFunds] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFundsInputChange = (event, ngo_id) => {
    const amount = event.target.value

    formatAmountToDisplay(amount)

    // Check if an object with the same ngo_id already exists
    const index = funds.findIndex((fund) => fund.ngo_id === ngo_id)

    if (index !== -1) {
      // If it exists, update the existing object
      setFunds((prevFunds) => {
        const updatedFunds = [...prevFunds]
        updatedFunds[index] = { ngo_id, amount }
        return updatedFunds
      })
    } else {
      // If it doesn't exist, add a new object
      setFunds((prevFunds) => [...prevFunds, { ngo_id, amount }])
    }
  }

  const formatAmountToDisplay = (amount: string) => {
    const formatted = amount
      .replace(/\D/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    setFormattedFunds(formatted)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    try {
      setIsLoading(true)
      if (donor) {
        //   await createBriefD({
        //     ...brief,
        //     ...fundsBrief
        //   })
        // } else {
        //   await createBrief({
        //     ...brief,
        //     ...fundsBrief
        //   })
      }

      setIsLoading(false)
      setIsModalOpen(true)
    } catch (error) {
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    if (donor) {
      navigate('/donor/dashboard')
    } else {
      navigate('/admin/dashboard')
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

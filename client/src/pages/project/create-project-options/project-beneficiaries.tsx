import { useRef, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import { AddPlusIcon } from '../../../assets/images/svgs'
import { States } from '../../../services/utils'
import ProgressHeader from '../../ngo/progress-header'
import { useBriefContext } from '../add-brief-context'
import AddBriefRow from './add-brief-row'

const ProjectBeneficiaries = ({ page, headers, changePage }) => {
  const formRef = useRef(null)
  const [state, setState] = useState<string>('')
  const [beneficiary_overview, setBeneficiary_overview] = useState<string>('')
  const [beneficiaries, setBeneficiaries] = useState<
    { state: string; city: string; community: string }[]
  >([])
  const { brief, addToBrief } = useBriefContext()

  const columns = [
    { label: 'State', width: 2 },
    { label: 'City', width: 5 },
    { label: 'Community', width: 5 }
  ]

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switch (event.currentTarget.id) {
      case 'state':
        setState(event.target.value)
        break
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    switch (event.target.name) {
      case 'overview':
        setBeneficiary_overview(event.target.value)
        break
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const state = e.currentTarget.state.value
    const city = e.currentTarget.city.value
    const community = e.currentTarget.community.value

    let init = [...beneficiaries]
    init.push({ state, city, community })
    setBeneficiaries(init)

    // Reset the form
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  const handleNext = () => {
    console.log(brief)
    console.log(beneficiary_overview)

    addToBrief({ beneficiary_overview })

    for (let i = 0; i < beneficiaries.length; i++) {
      let state = beneficiaries[i].state
      let city = beneficiaries[i].city
      let community = beneficiaries[i].community

      let stateKey = `beneficiaries[${i}][state]`
      let cityKey = `beneficiaries[${i}][city]`
      let communityKey = `beneficiaries[${i}][community]`

      addToBrief({
        [stateKey]: state,
        [cityKey]: city,
        [communityKey]: community
      })
    }
    changePage('Next')
  }

  return (
    <>
      <Container className='mt-3 admin-container w-75'>
        <ProgressHeader page={page} headers={headers} />

        <Form
          ref={formRef}
          className='mt-5 mx-5'
          id='form'
          onSubmit={handleSubmit}
        >
          <Row>
            <Col lg='12'>
              <Form.Group className='mb-4' style={{ textAlign: 'left' }}>
                <Form.Label>Beneficiaries Overview</Form.Label>
                <textarea
                  onChange={handleInputChange}
                  name='overview'
                  rows={4}
                  className='form-control'
                  placeholder='Details of the people going to benefit from this project'
                ></textarea>
              </Form.Group>
            </Col>
            <Row>
              <Col lg='4'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='state'
                >
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    className='normal-text p-1'
                    required
                    onChange={onSelectChange}
                  >
                    <option key={''}>Select State</option>
                    {Array.from(States.keys()).map((key) => {
                      return (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      )
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg='4'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='city'
                >
                  <Form.Label key={''}>City/LGA</Form.Label>
                  <Form.Select
                    className='normal-text p-1'
                    required
                    onChange={onSelectChange}
                    aria-label='Default select example'
                  >
                    <option value=''>Select LGA</option>
                    {States.has(state) &&
                      States.get(state)?.map((value) => {
                        return (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        )
                      })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col lg='3'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='community'
                >
                  <Form.Label>Community</Form.Label>
                  <Form.Control
                    className='normal-text'
                    type='text'
                    aria-label='Default select example'
                    required
                  ></Form.Control>
                </Form.Group>
              </Col>
              <Col lg='1'>
                <button className='mt-4' style={{ cursor: 'pointer' }}>
                  <AddPlusIcon />
                </button>
              </Col>
            </Row>
          </Row>
        </Form>
      </Container>
      <Container className='w-75 mt-4'>
        <AddBriefRow data={beneficiaries} columns={columns} />
        <Row className='mt-4'>
          <Col className='ps-0' lg='6'>
            <button
              onClick={() => changePage('Back')}
              className='btn-modal-back mb-5'
            >
              Back to Overview
            </button>
          </Col>
          <Col className='pe-0' lg='6'>
            <button onClick={handleNext} className='btn-modal mb-5'>
              Procced to milestones
            </button>
          </Col>
        </Row>
      </Container>
    </>
  )
}
export default ProjectBeneficiaries

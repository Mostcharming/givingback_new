import { useEffect, useRef, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import Select from 'react-select'

import { toast } from 'react-toastify'
import useBackendService from '../../../services/backend_service'
import ProgressHeader from '../../ngo/progress-header'
import { useBriefContext } from '../add-brief-context'
import AddBriefRow from './add-brief-row'

const columns = [
  { label: 'Name', width: 4 },
  { label: 'Brief', width: 8 }
]

const ProjectExecutors = ({ page, headers, changePage }) => {
  const formRef = useRef(null)
  const { brief, addToBrief, addExecutingNGOs } = useBriefContext()
  const [ngos, setNgos] = useState<any[]>([])
  const [executors, setExecutors] = useState<any[]>([])
  const [completeExecutors, setCompleteExecutors] = useState<any[]>([])
  const [ngoBrief, setNgoBrief] = useState<string>('')
  const [ngoId, setNgoId] = useState<number>()

  console.log(brief)

  const options = ngos.map((ngo) => ({
    value: ngo.id,
    label: ngo.name
  }))

  const { mutate: fetchUsers, isLoading } = useBackendService(
    '/donor/users',
    'GET',
    {
      onSuccess: (res: any) => {
        setNgos(res.users)
      },
      onError: (error) => {
        toast.error('Failed to fetch NGOs.')
      }
    }
  )

  useEffect(() => {
    fetchUsers({ page: 1, limit: 10000 })
  }, [setNgos])

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    switch (event.target.name) {
      case 'brief':
        setNgoBrief(event.target.value)
        break
    }
  }

  const handleNext = () => {
    if (executors.length === 0) {
      toast.error('You must add at least one NGO before proceeding.')
      return
    }

    for (let i = 0; i < executors.length; i++) {
      const id = ngos.find((ngo) => ngo.name == executors[i].name)?.id
      const brief = executors[i].brief

      const idKey = `ngos[${i}][id]`
      const briefKey = `ngos[${i}][brief]`

      addToBrief({
        [idKey]: id,
        [briefKey]: brief
      })
    }
    addExecutingNGOs(completeExecutors)
    changePage('Next')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const id = ngoId
    const brief = ngoBrief

    const name = ngos.find((ngo) => ngo.id == id)?.name
    let init = [...executors]
    init.push({ name, brief })
    setExecutors(init)

    let completeInit = [...completeExecutors]
    completeInit.push({ id: id.toString(), name, brief })
    setCompleteExecutors(completeInit)

    if (formRef.current) {
      formRef.current.reset()
    }
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
              <Form.Group
                className='mb-4'
                style={{ textAlign: 'left' }}
                controlId='ngoId'
              >
                <Form.Label>Select Executing Ngos</Form.Label>
                <Select
                  className='normal-text'
                  options={options}
                  placeholder='Select NGO'
                  isSearchable
                  onChange={(e) => setNgoId(e.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg='12'>
              <Form.Group className='mb-4' style={{ textAlign: 'left' }}>
                <Form.Label>NGO's Brief</Form.Label>
                <textarea
                  name='brief'
                  rows={4}
                  className='form-control'
                  onChange={handleInputChange}
                ></textarea>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg='6'>
              <button
                onClick={() => changePage('Back')}
                className='btn-modal-back mb-5'
              >
                Back to Milestones
              </button>
            </Col>
            <Col lg='6'>
              <button className='btn-modal mb-5'>Add to Brief</button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Container className='w-75 mt-4'>
        <AddBriefRow data={executors} columns={columns} />
        <button className='btn-modal mt-4' onClick={handleNext}>
          Proceed to Initiation
        </button>
      </Container>
    </>
  )
}
export default ProjectExecutors

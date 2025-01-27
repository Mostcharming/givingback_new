import { useEffect, useState } from 'react'
import { Col, Container, Form, Row } from 'react-bootstrap'
import Select from 'react-select'
import useBackendService from '../../../services/backend_service'
import { useContent } from '../../../services/useContext'
import ProgressHeader from '../../ngo/progress-header'
import { useBriefContext } from '../add-brief-context'

const ProjectOverview = ({ page, headers, changePage, donor = null }) => {
  const { authState, currentState } = useContent()
  const { brief, addToBrief } = useBriefContext()
  const [donors, setDonors] = useState<any[]>([])
  const [areas, setAreas] = useState([])
  const [sponsor, setSponsor] = useState<number>()
  const [category, setCategory] = useState<string>()

  const options = donors.map((donor) => ({
    value: donor.id,
    label: donor.name
  }))

  const { mutate: getAreas } = useBackendService('/areas', 'GET', {
    onSuccess: (res2: any) => {
      setAreas(res2 as any[])
    },
    onError: () => {}
  })
  const { mutate: getDonors } = useBackendService('/admin/donor', 'GET', {
    onSuccess: (res2: any) => {
      setDonors(res2.donors)
    },
    onError: () => {}
  })

  useEffect(() => {
    getAreas({})
    getDonors({})
    if (
      authState.user.role === 'donor' ||
      authState.user.role === 'corporate'
    ) {
      setSponsor(currentState.user.id)
    }
  }, [])

  const onThematicAreaChange = (event: { value: string; label: string }[]) => {
    const interest_area = event.map((item) => item.value).join(',')
    setCategory(interest_area)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = e.currentTarget.projectTitle.value
    const startDate = e.currentTarget.startDate.value
    const endDate = e.currentTarget.endDate.value
    const description = e.currentTarget.description.value
    const objectives = e.currentTarget.objectives.value
    const scope = e.currentTarget.account.value

    const brief = {
      title,
      donor_id: sponsor,
      startDate,
      endDate,
      description,
      objectives,
      category,
      scope
    }

    addToBrief(brief)

    changePage('Next')
  }
  return (
    <Container className='mt-3 admin-container w-75'>
      <ProgressHeader page={page} headers={headers} />

      <Form className='mt-5 mx-5' id='form' onSubmit={handleSubmit}>
        <Row>
          <Col lg='12'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='projectTitle'
            >
              <Form.Label>Project Title</Form.Label>
              <Form.Control
                type='text'
                defaultValue={brief?.title}
                required
                placeholder='Enter Project Title'
              />
            </Form.Group>
          </Col>
          {authState.user.role === 'admin' && (
            <Col lg='6'>
              <Form.Group
                className='mb-4'
                style={{ textAlign: 'left' }}
                controlId='sponsor'
              >
                <Form.Label>The Project Sponsor</Form.Label>
                <Select
                  className='normal-text'
                  options={options}
                  placeholder='Select Sponsor'
                  isSearchable
                  onChange={(e) => setSponsor(e.value)}
                  required
                />
              </Form.Group>
            </Col>
          )}

          <Col lg='6'>
            <Row>
              <Col lg='6'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='startDate'
                >
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type='date'
                    required
                    defaultValue={brief?.startDate}
                  />
                </Form.Group>
              </Col>
              <Col lg='6'>
                <Form.Group
                  className='mb-4'
                  style={{ textAlign: 'left' }}
                  controlId='endDate'
                >
                  <Form.Label> End Date</Form.Label>
                  <Form.Control
                    type='date'
                    required
                    defaultValue={brief?.endDate}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
          {/* <Row> */}
          <Col lg='6'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='category'
            >
              <Form.Label>Select Thematic Area</Form.Label>
              <Select
                placeholder='Thematic Area'
                required
                onChange={onThematicAreaChange}
                //@ts-ignore
                options={areas.map((category) => ({
                  value: category.name,
                  label: category.name
                }))}
                isMulti
                value={brief?.category
                  ?.split(',')
                  .map((item) => ({ value: item, label: item }))}
              />
            </Form.Group>
          </Col>
          <Col lg='6'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='account'
            >
              <Form.Label>Select Project Scope</Form.Label>
              <Form.Select
                className='normal-text p-2'
                aria-label='Default select example'
                required
                defaultValue={brief?.scope}
              >
                <option value='national'>National</option>
                <option value='regional'>Regional</option>
                <option value='state'>State</option>
                <option value='city'>City</option>
                <option value='community'>Community</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {/* </Row> */}
          <Col lg='12'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='description'
            >
              <Form.Label>Project Overview/Description</Form.Label>
              <textarea
                name='description'
                rows={4}
                className='form-control'
                placeholder='What is the project about?'
                required
                defaultValue={brief?.description}
              ></textarea>
            </Form.Group>
          </Col>
          <Col lg='12'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='objectives'
            >
              <Form.Label>Project Objectives</Form.Label>
              <textarea
                name='objectives'
                rows={4}
                className='form-control'
                placeholder='What are the KPIs agreed with the donor(s)'
                required
                defaultValue={brief?.objectives}
              ></textarea>
            </Form.Group>
          </Col>
        </Row>
        <button className='btn-modal mb-5'>Proceed to Beneficiaries</button>
      </Form>
    </Container>
  )
}
export default ProjectOverview

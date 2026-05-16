//@ts-nocheck

import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

import Select from 'react-select'
import useBackendService from '../../../services/backend_service'
import { usePastProjectContext } from '../add-past-project-context'

interface DetailsProps {
  changePage?
  edit?: boolean
}

const Details = ({ changePage, edit }: DetailsProps) => {
  const { pastProjects, addPastProject } = usePastProjectContext()
  const [project, setProject] = useState<ProjectBriefItem>({
    title: '',
    category: '',
    duration: '',
    status: '',
    description: '',
    cost: 0,
    raised: 0
  })
  const [duration, setDuration] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [areas, setAreas] = useState([])

  useEffect(() => {
    async function fetchProject() {
      // const response = (await getProjectById(edit)).data.project
      // setProject(response)
      // setDuration(response.startDate + '  -  ' + response.endDate)
    }
    if (edit) {
      fetchProject()
    }
  }, [setProject])

  const { mutate: getAreas } = useBackendService('/areas', 'GET', {
    onSuccess: (res2: any) => {
      setAreas(res2 as any[])
    },
    onError: () => {}
  })

  useEffect(() => {
    getAreas({})
  }, [])

  const handleCategoryChange = (event: { value: string; label: string }[]) => {
    const categories = event.map((item) => item.value).join(',')
    setProject({ ...project, category: categories })
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProject({ ...project, status: event.target.value })
  }

  const onNext = () => {
    if (edit) {
      return changePage('Next')
    }
  }

  const handleSubmit = async (event: React.UIEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = event.currentTarget.title.value
    const duration = event.currentTarget.duration.value
    const status = event.currentTarget.status.value
    const description = event.currentTarget.description.value
    const cost = event.currentTarget.cost.value
    const raised = event.currentTarget.amountRaised.value
    const category = project.category

    if (edit) {
      return changePage('Next')
    }

    addPastProject({
      title,
      category,
      duration,
      status,
      description,
      cost,
      raised
    })
    changePage('Next')
  }

  return (
    <div className='bg-white p-4'>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col lg='12'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='title'
            >
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Enter the title or name of the project'
                defaultValue={
                  edit
                    ? project.title || pastProjects?.title
                    : pastProjects?.title || ''
                }
              />
            </Form.Group>
          </Col>
          <Col lg='6'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='category'
            >
              <Form.Label>Thematic Area</Form.Label>
              <Select
                placeholder='Select Thematic Area'
                required
                // defaultValue={edit && project.category || pastProjects?.category}
                value={
                  (edit && [
                    { value: project.category, label: project.category }
                  ]) ||
                  (pastProjects?.category &&
                    pastProjects?.category.split(',').map((category) => ({
                      value: category,
                      label: category
                    })))
                }
                onChange={handleCategoryChange}
                className='select-custom'
                options={areas.map((category, index) => ({
                  value: category.name,
                  label: category.name
                }))}
                isMulti
              />
            </Form.Group>
          </Col>
          <Col lg='6'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='duration'
            >
              <Form.Label>Project Duration</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Enter duration of project'
                defaultValue={
                  edit
                    ? duration || pastProjects?.duration
                    : pastProjects?.duration || ''
                }
              />
            </Form.Group>
          </Col>
          <Col lg='12'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='status'
            >
              <Form.Label>Project Status</Form.Label>
              <Form.Select
                required
                defaultValue={(edit && project.status) || pastProjects?.status}
                onChange={handleStatusChange}
                className='p-1 select-custom'
              >
                <option>Select Project Status</option>
                <option value='Completed'>Completed</option>
                <option value='Ongoing'>Ongoing</option>
                <option value='Suspended'>Suspended</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col lg='12'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='description'
            >
              <Form.Label>Project Description / Overview</Form.Label>
              <Form.Control
                required
                type='text'
                as='textarea'
                placeholder='Describe this Project'
                rows={3}
                style={{ height: '100px' }}
                defaultValue={
                  edit
                    ? project.description || pastProjects?.description
                    : pastProjects?.description || ''
                }
              />
            </Form.Group>
          </Col>
          <Col lg='6'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='cost'
            >
              <Form.Label>Project Cost (NGN)</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='0.00'
                defaultValue={
                  edit
                    ? project.cost || pastProjects?.cost
                    : pastProjects?.cost || ''
                }
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, '')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  e.target.value = value
                }}
              />
            </Form.Group>
          </Col>
          <Col lg='6'>
            <Form.Group
              className='mb-4'
              style={{ textAlign: 'left' }}
              controlId='amountRaised'
            >
              <Form.Label>Amount Raised (NGN)</Form.Label>
              <Form.Control
                type='text'
                placeholder='0.00'
                defaultValue={
                  edit
                    ? project.raised || pastProjects?.raised
                    : pastProjects?.raised || ''
                }
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, '')
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  e.target.value = value
                }}
              />
            </Form.Group>
          </Col>
          <Col lg='12'>
            <div style={{ float: 'right' }}>
              <Button
                className=' px-3 text-white'
                style={{ background: '#7B80DD' }}
                type='submit'
                onClick={onNext}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
      {loading && <Loading />}
    </div>
  )
}

export default Details

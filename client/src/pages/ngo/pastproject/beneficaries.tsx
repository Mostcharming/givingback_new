import { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { usePastProjectContext } from '../add-past-project-context'

const Beneficiaries = ({ changePage, edit }) => {
  const { pastProjects, addPastProject } = usePastProjectContext()
  const [beneficaries, setBeneficiaries] = useState<any[]>([])
  const [project, setProject] = useState<any>()

  useEffect(() => {
    let key
    let matches = []
    for (key in pastProjects) {
      if (key.startsWith('beneficiaries')) {
        // Use regular expressions to extract the values
        const match = key.match(/\[(\d+)\]\[([^\]]+)\]/)

        if (match) {
          const numericValue = parseInt(match[1], 10)
          const stringValue = match[2]

          if (!matches.includes(numericValue)) {
          
            add('kalls')
          }

          matches.push(numericValue)
        } else {
          console.log('Invalid format')
        }
      }
    }
  }, [pastProjects])

  useEffect(() => {
    async function fetchProject() {
      // const response = (await getProjectById(edit)).data.project;
      // setProject(response);
    }
    if (edit) {
      fetchProject()
    }
  }, [setProject])

  const add = (value?) => {
    let init = [...beneficaries]
    init.push({
      name: `Beneficiary ${init.length + 1}`,
      contact: `Contact ${init.length + 1}`,
      location: `Location ${init.length + 1}`,
      value: value
    })
    setBeneficiaries((prevBeneficiaries) =>
      prevBeneficiaries.concat({
        name: `Beneficiary ${prevBeneficiaries.length + 1}`,
        contact: `Contact ${prevBeneficiaries.length + 1}`,
        location: `Location ${prevBeneficiaries.length + 1}`
      })
    )
  }

  const handleSubmit = async (event: React.UIEvent<HTMLFormElement>) => {
    event.preventDefault()

    for (let i = 0; i < beneficaries.length; i++) {
      let name = event.currentTarget[`${beneficaries[i].name}`].value
      let contact = event.currentTarget[`${beneficaries[i].contact}`].value
      let location = event.currentTarget[`${beneficaries[i].location}`].value

      let nameKey = `beneficiaries[${i}][name]`
      let contactKey = `beneficiaries[${i}][contact]`
      let locationKey = `beneficiaries[${i}][location]`

      addPastProject({
        [nameKey]: name,
        [contactKey]: contact,
        [locationKey]: location
      })
    }

    changePage('Next')
  }

  const back = () => changePage('Back')

  return (
    <div className='bg-white p-4'>
      {edit ? (
        <Row>
          <Col lg='12'>
            {project?.beneficiaries.map((beneficiary, index) => {
              return (
                <Row key={index}>
                  <Row>
                    <Col lg={6}>
                      <Form.Group
                        className='mb-4'
                        style={{ textAlign: 'left' }}
                      >
                        <Form.Label>{'Beneficiary ' + (index + 1)}</Form.Label>
                        <Form.Control required type='text' />
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group
                        className='mb-4'
                        style={{ textAlign: 'left' }}
                      >
                        <Form.Label>Beneficiary's Location</Form.Label>
                        <Form.Control
                          required
                          type='text'
                          value={beneficiary.city}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6}>
                      <Form.Group
                        className='mb-4'
                        style={{ textAlign: 'left' }}
                        controlId={beneficiary.contact}
                      >
                        <Form.Label>Contact Details of Beneficiary</Form.Label>
                        <Form.Control required type='text' />
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <Form.Group
                        className='mb-4'
                        style={{ textAlign: 'left' }}
                        controlId={beneficiary.contact}
                      >
                        <Form.Label>Contact's Location</Form.Label>
                        <Form.Control required type='text' />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Form.Group
                        className='mb-4'
                        style={{ textAlign: 'left' }}
                      >
                        <Form.Label>Overview</Form.Label>
                        <Form.Control
                          required
                          type='text'
                          value={project.beneficiary_overview}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>
              )
            })}
          </Col>
          <Col lg='12'>
            <div style={{ float: 'right' }}>
              <Button
                className='btn-custom px-3 me-3 text-white'
                variant='primary'
                onClick={back}
                type='button'
              >
                Back
              </Button>
              <Button
                className='btn-custom px-3 text-white'
                onClick={() => {
                  changePage('Next')
                }}
              >
                Next
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg='12'>
              {beneficaries.map((beneficiary) => {
                return (
                  <Row key={beneficiary.name}>
                    <Col lg={4}>
                      <Form.Group
                        className='mb-4'
                        style={{ textAlign: 'left' }}
                        controlId={beneficiary.name}
                      >
                        <Form.Label>{beneficiary.name}</Form.Label>
                        <Form.Control
                          required
                          type='text'
                          placeholder='Enter Name of Beneficiary'
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={4}>
                      <Form.Group
                        className='mb-4'
                        style={{ textAlign: 'left' }}
                        controlId={beneficiary.contact}
                      >
                        <Form.Label>Contact Details of Beneficiary</Form.Label>
                        <Form.Control
                          required
                          type='text'
                          placeholder='Enter Contact Details of Beneficiary'
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={4}>
                      <Form.Group
                        className='mb-4'
                        style={{ textAlign: 'left' }}
                        controlId={beneficiary.location}
                      >
                        <Form.Label>Location of Beneficiary</Form.Label>
                        <Form.Control
                          required
                          type='text'
                          placeholder='Enter Location/Address of Beneficiary'
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )
              })}
            </Col>
            <Col lg='12'>
              <Button
                className=' px-3 text-white'
                style={{ background: '#7B80DD' }}
                type='button'
                onClick={add}
              >
                {'\u002B Add Another Beneficiary'}
              </Button>
              <div style={{ float: 'right' }}>
                <Button
                  className=' px-3 me-3 text-white'
                  style={{ background: '#7B80DD' }}
                  onClick={back}
                  type='button'
                >
                  Back
                </Button>
                <Button
                  className=' px-3 text-white'
                  style={{ background: '#7B80DD' }}
                  type='submit'
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  )
}

export default Beneficiaries

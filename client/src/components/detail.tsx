//@ts-nocheck

import { useEffect, useState } from 'react'
import { FormSelect, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Col, Modal, Row } from 'reactstrap'
import useBackendService from '../services/backend_service'
import { capitalizeFirstLetter } from '../services/capitalize'
import { useContent } from '../services/useContext'
import Loading from './home/loading'

const Detail = (props: { projectID: number; isAdmin?: boolean }) => {
  const navigate = useNavigate()
  const { authState } = useContent()
  const [previousProject, setpreviousProject] = useState('')
  const [img, setImg] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [sampleDataArray, setSampleDataArray] = useState([])

  const handleModalOpen = () => {
    setShowModal(true)
  }

  const handleModalClose = () => {
    location.reload()
  }

  const { mutate: getTableData, isLoading } = useBackendService(
    '/allprojects',
    'GET',
    {
      onSuccess: (res: any) => {
        setpreviousProject(res.projects[0])
        setImg(res.projects[0].projectImages[0].image)
      },
      onError: () => {
        toast.error('Error getting projects data')
      }
    }
  )

  const exportProject = async () => {
    try {
      // const response = await exportProjectReport(props.projectID)
      // const link = document.createElement('a')
      // link.href = window.URL.createObjectURL(response.data)
      // link.download = 'project_report.xlsx' // Adjust the file name and extension as necessary
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
    } catch (error) {
      toast.error('Error exporting project report')
    }
  }

  useEffect(() => {
    getTableData({ projectType: 'previous', id: props.projectID })
  }, [])

  const handleMSubmit = async (event) => {
    event.preventDefault()
    try {
      const formData = {
        title: event.target.campaignTitle.value,
        start_date: event.target.startDate.value,
        end_date: event.target.endDate.value,
        target: event.target.target.value,
        description: event.target.description.value,
        id: props.projectID
      }

      await createCampaign(
        formData.title,
        formData.start_date,
        formData.end_date,
        formData.target,
        formData.description,
        formData.id
      )
      event.target.campaignTitle.value = ''
      event.target.startDate.value = ''
      event.target.endDate.value = ''
      event.target.target.value = ''
      event.target.description.value = ''

      toast.success('Success')
    } catch (error) {
      console.log(error)
    }
  }

  const { mutate: updateP } = useBackendService(
    `/admin/previous-project/${props.projectID}`,
    'POST',
    {
      onSuccess: (res: any) => {
        toast.success(`Project status updated`)
      },
      onError: () => {
        toast.error('Error updating project status')
      }
    }
  )
  const handleVerificationChange = async (status) => {
    if (!status) return
    updateP({ status: status })
  }

  return (
    <>
      {isLoading && <Loading />}
      {previousProject && (
        <div className='mb-4'>
          {authState.user.role === 'admin' && (
            <div>
              {/* <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  className='px-2 btn-custom text-white px-4'
                  variant='primary'
                  type='button'
                  onClick={exportProject}
                >
                  Export Project Report
                </Button>
              </div> */}
              <FormSelect
                aria-label='Mark as Verified'
                onChange={(e) => handleVerificationChange(e.target.value)}
                style={{ width: '200px', marginLeft: '10px' }}
              >
                <option value=''>Mark as Verified</option>
                <option value='verified'>Verified</option>
                <option value='pending'>Pending</option>
                <option value='rejected'>Rejected</option>
              </FormSelect>
            </div>
          )}
          <div className='mt-4' style={{ backgroundColor: 'white' }}>
            <div style={{ padding: '30px' }}>
              <Image fluid={true} src={img} style={{ width: '100%' }} />
              <div className='mt-4'>
                <span
                  className='rounded px-2 py-1 fw-bold'
                  style={{ backgroundColor: '#C9ECCB' }}
                >
                  {capitalizeFirstLetter(previousProject.status)}
                </span>
              </div>
              <br />
              <h3 className='detail-header'>Description</h3>
              <p>{previousProject.description}</p>
              <br />
              <Row>
                <Col md={4}>
                  <h3 className='detail-header'> Cost</h3>
                  <p>₦{previousProject.cost}</p>
                </Col>
                <Col md={4}>
                  <h3 className='detail-header'>Amount raised</h3>
                  <p>₦{previousProject.raised}</p>
                </Col>
                <Col md={4}>
                  <h3 className='detail-header'>Duration</h3>
                  <p>{previousProject.duration}</p>
                </Col>
              </Row>
              <h3 className='detail-header'>Sponsors</h3>
              <Row style={{ backgroundColor: '#F0F1FB' }} className='p-2'>
                <Col>Name</Col>
                <Col>Description</Col>
              </Row>
              {previousProject.sponsors.map((sponsor) => (
                <Row key={sponsor.id} className='p-2'>
                  <Col>
                    <img
                      src={sponsor.image}
                      alt='sponsor logo'
                      style={{ width: '50px', height: '50px' }}
                    />
                    {sponsor.name}
                  </Col>
                  <Col>{sponsor.description}</Col>
                </Row>
              ))}
              <hr />

              <h3 className='detail-header'>Beneficiaries</h3>
              <Row style={{ backgroundColor: '#F0F1FB' }} className='p-2'>
                <Col>Name</Col>
                <Col>Contact</Col>
                <Col>Location</Col>
              </Row>
              {previousProject.beneficiaries.map((beneficiary) => (
                <Row key={beneficiary.id} className='p-2'>
                  <Col>{beneficiary.name}</Col>
                  <Col>{beneficiary.contact}</Col>
                  <Col>{beneficiary.location}</Col>
                </Row>
              ))}
              <hr />

              <h3 className='detail-header'>Media (Photos & Videos)</h3>
              {previousProject.projectImages.map((image) => (
                <Row key={image.id}>
                  <Col>
                    <img
                      src={image.image}
                      alt='project image'
                      className='img-responsive w-25'
                    />
                  </Col>
                </Row>
              ))}
            </div>
          </div>

          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton style={{ border: 'none' }}></Modal.Header>
            <Modal.Body
              style={{
                borderTop: '5px solid #6C72D9',
                borderBottom: '5px solid #6C72D9'
              }}
            >
              <p style={{ fontSize: '30px' }}>Create Fundraising Campaign</p>
              <form onSubmit={handleMSubmit}>
                <label>Campaign Title</label>
                <input
                  name='campaignTitle'
                  type='text'
                  className='form-control'
                />

                <label>Start Date</label>
                <input name='startDate' type='date' className='form-control' />

                <label>End Date</label>
                <input name='endDate' type='date' className='form-control' />

                <label>Amount</label>
                <input name='target' type='number' className='form-control' />

                <label>Description</label>
                <textarea
                  name='description'
                  rows={4}
                  className='form-control'
                ></textarea>

                <Button className='btn btn-custom mt-3' type='submit'>
                  Create Campaign
                </Button>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  )
}
export default Detail

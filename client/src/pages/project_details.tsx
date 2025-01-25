import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { formatDate, truncateText } from '../components/formatTime'
import Loading from '../components/home/loading'
import MileStoneUpdateModal from '../components/MilestoneUpdateModal'
import Tables from '../components/tables'
import ViewMileStoneUpdateModal from '../components/ViewMilestoneUpdateModal'
import useBackendService from '../services/backend_service'
import { useContent } from '../services/useContext'

const ProjectViewDetail: React.FC<any> = ({ ngo = null }) => {
  const [activeTab, setActiveTab] = useState('detail')
  const [project, setProject] = useState<any>(null)
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState<boolean>(true)
  const { authState } = useContent()

  const { mutate: getTableData, isLoading } = useBackendService(
    '/allprojects',
    'GET',
    {
      onSuccess: (res: any) => {
        setProject(res.projects[0])
        setLoading(false)
      },
      onError: () => {
        setLoading(false)
        toast.error('Error getting projects data')
      }
    }
  )

  useEffect(() => {
    getTableData({ projectType: 'present', id: id })
  }, [id])

  const renderForm = () => {
    return activeTab === 'detail' ? (
      <ProjectSummary project={project} ngo={ngo} />
    ) : activeTab === 'media' ? (
      <Media project={project} />
    ) : activeTab === 'community' ? (
      <Community project={project} />
    ) : activeTab === 'updates' ? (
      <Updates project={project} />
    ) : null
  }

  const renderTabs = () => {
    return (
      <div className='tabs' style={tabsContainerStyle}>
        <div>
          <Tab
            label='Details'
            active={activeTab === 'detail'}
            onClick={() => setActiveTab('detail')}
          />
          <Tab
            label='Updates'
            active={activeTab === 'updates'}
            onClick={() => setActiveTab('updates')}
          />
          <Tab
            label='Media'
            active={activeTab === 'media'}
            onClick={() => setActiveTab('media')}
          />
          {authState.user.role !== 'NGO' && (
            <Tab
              label='Community'
              active={activeTab === 'community'}
              onClick={() => setActiveTab('community')}
            />
          )}
        </div>
        {authState.user.role === 'admin' && (
          <Button
            variant='light'
            style={exportButtonStyle}
            onClick={() => handleExportClick()}
          >
            Export Project Report
          </Button>
        )}
      </div>
    )
  }

  const handleExportClick = async () => {
    const doc = new jsPDF('p', 'pt', 'a4')

    const projectSection = document.querySelector('.project-overview')
    if (projectSection) {
      const canvas = await html2canvas(projectSection as HTMLElement)
      const imgData = canvas.toDataURL('image/png')

      doc.text('Project Report', 20, 30)
      doc.addImage(imgData, 'PNG', 20, 60, 560, 300)
    }

    doc.text(`Project Name: ${project?.title || 'Not available'}`, 20, 380)
    doc.text(`Cost: ₦${project?.cost || 'Not provided'}`, 20, 400)
    doc.text(`Amount Raised: ₦${project?.allocated || 0}`, 20, 420)
    doc.text(
      `Start Date: ${
        project?.startDate
          ? new Date(project.startDate).toLocaleDateString()
          : 'Not available'
      }`,
      20,
      440
    )
    doc.text(
      `End Date: ${
        project?.endDate
          ? new Date(project.endDate).toLocaleDateString()
          : 'Not available'
      }`,
      20,
      460
    )

    if (project?.milestones && project.milestones.length > 0) {
      project.milestones.forEach((milestone: any, index: number) => {
        doc.text(
          `Milestone ${index + 1}: ${milestone.milestone}`,
          20,
          480 + index * 20
        )
      })
    } else {
      doc.text('No milestones available', 20, 480)
    }

    doc.save(`${project?.title || 'Project'}_Report_givingback.pdf`)
    toast.success('Project report exported successfully!')
  }

  return (
    <div>
      {loading && <Loading type={'inline'} />}
      <Container className='mt-2'>
        <div
          style={{
            background: '#7B80DD',
            boxShadow: '1px 4px 11px 0px #CEBDE4',
            height: '55px',
            borderRadius: '5px 0px 0px 0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Space between tabs and button
            opacity: 0.9,
            paddingLeft: '20px',
            paddingRight: '20px', // Added paddingRight for spacing
            color: '#fff',
            fontFamily: 'Nunito Sans',
            fontSize: '18px',
            fontWeight: 400
          }}
        >
          {renderTabs()}
        </div>

        <div className='form-container mt-4'>{renderForm()}</div>
      </Container>
    </div>
  )
}

const Tab: React.FC<{
  label: string
  active: boolean
  onClick?: () => void
}> = ({ label, active, onClick }) => (
  <span
    className={`tab ${active ? 'active' : ''}`}
    onClick={onClick}
    style={tabStyle(active)}
  >
    {label}
  </span>
)

const tabStyle = (isActive: boolean) => ({
  padding: '5px 20px',
  cursor: 'pointer',
  borderBottom: isActive ? '2px solid white' : '2px solid transparent',
  fontWeight: isActive ? 600 : 400
})

const exportButtonStyle = {
  background: '#fff',
  color: '#7B80DD',
  fontWeight: 600,
  borderRadius: '5px',
  padding: '5px 10px'
}

const tabsContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center'
}

const ProjectSummary: React.FC<any> = ({ project, ngo = null }) => {
  const [comment, setComment] = useState('')
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }
  const { id } = useParams<{ id: string }>()
  const { authState } = useContent()
  const endpoint =
    authState.user.role === 'admin'
      ? `/admin/project/${id}/message`
      : `/donor/project/${id}/message`

  const { mutate: getTableData, isLoading } = useBackendService(
    endpoint,
    'POST',
    {
      onSuccess: (res: any) => {
        toast.success('Feedback/Comment submitted successfully!')
        setComment('')
      },
      onError: () => {
        toast.error('Failed to submit feedback/comment. Please try again.')
      }
    }
  )

  const handleCommentSubmit = async () => {
    getTableData({ comment: comment })
  }
  if (!project) return <p>No project data available</p>
  const categories = project.category ? project.category.split(',') : []
  const calculatePercentage = (achievement: number, target: number) => {
    if (target === 0 || !target) return 'N/A'
    return ((achievement / target) * 100).toFixed(2) + '%'
  }

  return (
    <>
      <div className='mt-4' style={{ backgroundColor: 'white' }}>
        <div style={{ padding: '30px' }}>
          {project.images && project.images.length > 0 ? (
            <img
              src={project.images[0]?.image}
              alt='Project'
              style={{ width: '100%' }}
            />
          ) : (
            <p>No image available</p>
          )}

          <div className='mt-4'>
            <span
              className='rounded px-2 py-1 fw-bold'
              style={{ backgroundColor: '#C9ECCB' }}
            >
              {/* Ensure status exists */}
              {project.status
                ? project.status.charAt(0).toUpperCase() +
                  project.status.slice(1)
                : 'Unknown status'}
            </span>
          </div>
          <br />
          <h3 className='detail-header' style={{ backgroundColor: '#F0F1FB' }}>
            <span style={{ padding: '10px' }}>Project Overview</span>
          </h3>
          <p>{project.description || 'No description available'}</p>
          <br />
          <Row>
            <Col md={4}>
              <h3 className='detail-header'>Cost</h3>
              <p>{project.cost ? `₦${project.cost}` : 'Not provided'}</p>
            </Col>
            <Col md={4}>
              <h3 className='detail-header'>Amount raised</h3>
              <p>₦{project.allocated || 0}</p>
            </Col>
            <Col style={{ display: 'flex' }} md={4}>
              <div className='pr-5'>
                <h3 className='detail-header'>Start Date</h3>
                <p>
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : 'Start date not available'}{' '}
                </p>
              </div>
              <div>
                <h3 className='detail-header'>End Date</h3>
                <p>
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : 'End date not available'}
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <h3 className='detail-header'>Focus Category</h3>
              <p>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#E0E0E0',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        marginRight: '10px',
                        marginBottom: '10px'
                      }}
                    >
                      {category.trim()}
                    </span>
                  ))
                ) : (
                  <p>Not provided</p>
                )}
              </p>
            </Col>
          </Row>
          <h3 className='detail-header p-2 mt-3'>Objectives</h3>
          <Row style={{ backgroundColor: '#F0F1FB' }} className='p-2'>
            <Col>S/N</Col>
            <Col md={11}>Objective</Col>
          </Row>
          <Row className='p-2'>
            <Col>1</Col>
            <Col md={11}>{project.objectives || 'No objectives available'}</Col>
          </Row>

          <hr />

          <h3 className='detail-header p-2'>Target Beneficiaries</h3>
          <Row style={{ backgroundColor: '#F0F1FB' }} className='p-2'>
            <Col>Community</Col>
            <Col>Location</Col>
            <Col>Details</Col>
          </Row>
          {/* Ensure beneficiary array exists */}
          {project.beneficiary && project.beneficiary.length > 0 ? (
            project.beneficiary.map((beneficiary: any, index: number) => (
              <Row key={index} className='p-2'>
                <Col>{beneficiary.city || 'N/A'}</Col>
                <Col>{beneficiary.state || 'N/A'}</Col>
                <Col>{beneficiary.community || 'N/A'}</Col>
              </Row>
            ))
          ) : (
            <p>No beneficiary data available</p>
          )}
          <hr />
          <h3 className='detail-header p-2'>Milestones</h3>
          <Row style={{ backgroundColor: '#F0F1FB' }} className='p-2'>
            <Col md={1}>S/N</Col>
            <Col md={2}>Milestone</Col>
            <Col md={1}>Actual</Col>
            <Col md={1}>Target</Col>
            <Col md={1}>%</Col>
            <Col>Details</Col>
          </Row>
          {project.milestones && project.milestones.length > 0 ? (
            project.milestones.map((milestone: any, index: number) => {
              const update = milestone.milestoneUpdates?.[0]
              return (
                <Row key={milestone.id} className='p-2'>
                  <Col md={1}>{index + 1}</Col>
                  <Col md={2}>{milestone.milestone}</Col>
                  <Col md={1}>{milestone.target || 'N/A'}</Col>
                  <Col md={1}>{update?.achievement || 'N/A'}</Col>
                  <Col md={1}>
                    {update
                      ? calculatePercentage(
                          update.achievement,
                          milestone.target
                        )
                      : 'N/A'}
                  </Col>
                  <Col>{update?.narration || 'No details available'}</Col>
                </Row>
              )
            })
          ) : (
            <p>No milestones available</p>
          )}
          <hr />
        </div>
      </div>
      {(authState.user.role === 'donor' ||
        authState.user.role === 'corporate' ||
        authState.user.role === 'admin') && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: 'white'
          }}
        >
          <h3 className='detail-header p-2'>
            {authState.user.role === 'admin' ? "Admin's Feedback" : 'Comment'}
          </h3>
          <Form>
            <Form.Group controlId='comment'>
              <Form.Control
                as='textarea'
                rows={4}
                value={comment}
                onChange={handleCommentChange}
                placeholder='Write your comment here...'
                style={{ resize: 'none' }}
              />
            </Form.Group>
            <Button
              style={{
                backgroundColor: '#7B80DD',
                borderColor: '#7B80DD',
                width: '100%',
                padding: '10px',
                marginTop: '30px'
              }}
              variant='primary'
              onClick={handleCommentSubmit}
            >
              Submit
            </Button>
          </Form>
        </div>
      )}
    </>
  )
}

const Community: React.FC<any> = ({ project }) => {
  const [messages, setMessages] = useState<any[]>()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // const res = await getCommunityMessagesByProjectId(project?.id)
        // console.log(project)
        // setMessages(res.data.messages)
      } catch (err) {
        toast.error('Error fetching community details')
      }
    }

    fetchProject()
  }, [project])

  const comment = useRef(null)

  return (
    <div className='comment__container'>
      {/* <h4>Community Responses</h4> */}
      <hr />
      {/* <div className='user-comment__area'>
        <img className='avatar_img' src='/assets/avatar.svg' />
        <div className='user-comment__container'>
          <div>
            <div className='user-details'>
              <p style={{ fontWeight: '600' }}>User</p>
              <p>{messages?.length} Comments</p>
            </div>
            <textarea placeholder='Join the discussion...' ref={comment} />
            <button
              className='float-end mt-2 comment_button'
              // onClick={handleComment}
            >
              Comment
            </button>
          </div>
        </div>
      </div> */}
      <div className='comment-reply__container w-[70vw]'>
        {/* {messages?.map((messages) => {
          return <CommentCard key={messages.id} message={messages} />
        })} */}

        {/* <button
          className='view__all--button'
          // onClick={getMessages}
        >
          View All Comments
        </button> */}
      </div>
    </div>
  )
}

const Media: React.FC<any> = ({ project }) => {
  if (!project || !project.images || project.images.length === 0) {
    return <p>No media available</p>
  }

  return (
    <div className='media-container' style={mediaContainerStyle}>
      {project.images.map((image: any, index: number) => (
        <img
          key={index}
          src={image.image}
          alt={`Project image ${index + 1}`}
          style={imageStyle}
        />
      ))}
    </div>
  )
}
const Updates: React.FC<any> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [milestones, setMilestones] = useState<any[]>(project.milestones)
  const [currentMilestone, setCurrentMilestone] = useState<number>(0)
  const [milestoneUpdateData, setMilestoneUpdateData] = useState<any>()
  const [headers, setHeaders] = useState([
    'Date',
    'Achievement',
    'Position',
    'Status',
    'Narration',
    'FeedBack'
  ])
  const [actions, setActions] = useState([
    {
      label: 'Update',
      onClick: (row) => onCellClicked(row)
    }
  ])

  const updateStatus = () => {
    setIsModalOpen(true)
  }
  const updateStatusD = () => {
    // setIsModalOpen(true)
  }

  const changeMilestone = (index) => {
    
    setCurrentMilestone(index)
  }

  let rows = []



  if (milestones) {
    rows = milestones[currentMilestone].updates.map((milestone, index) => {
      return {
        id: index + 1,
        date: formatDate(milestone.createdAt),
        achievement: milestone.achievement,
        position: milestone.position,
        status: milestone.status,
        narration: truncateText(milestone.narration),
        feedBack: 'feedBack'
      }
    })
  }
  const onCellClicked = (row) => {
    setMilestoneUpdateData(row)
    setIsViewModalOpen(true)
  }
  const { authState } = useContent()

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly', // Evenly spaces items
          marginTop: '20px' // Optional, for spacing above
        }}
      >
        {milestones?.map((milestone, index) => {
          const isActive = currentMilestone === index // Assuming activeMilestone stores the active milestone index

          return (
            <span
              className={`p-2 px-3 me-2 bg-white cursor-pointer ${
                isActive ? 'active-milestone' : ''
              }`}
              key={index}
              onClick={() => changeMilestone(index)}
              style={{
                backgroundColor: isActive ? '#7B80DD' : 'white', // Purple for active
                color: isActive ? 'white' : 'black', // Text color adjustment
                borderRadius: '5px', // Optional, for rounded corners
                textAlign: 'center', // Center text
                minWidth: '30px' // Consistent size
              }}
            >
              {index + 1}
            </span>
          )
        })}
      </div>

      {milestones && (
        <Row className='mb-4'>
          <Col lg={6}>
            <Row>
              <Col lg={7}>
                <Form.Group className='mb-4' style={{ textAlign: 'left' }}>
                  <Form.Label>Milestone</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    value={milestones[currentMilestone].milestone}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group className='mb-4' style={{ textAlign: 'left' }}>
                  <Form.Label>Target</Form.Label>
                  <Form.Control
                    required
                    type='text'
                    value={milestones[currentMilestone].target}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
          {authState.user.role === 'NGO' && (
            <Col lg={6}>
              <Button
                className='float-end mt-4'
                style={{
                  backgroundColor: '#7B80DD',
                  color: '#fff',
                  borderRadius: '3px',
                  border: 'none'
                }}
                onClick={updateStatus}
              >
                + Update Status
              </Button>
            </Col>
          )}
        </Row>
      )}
      <Tables
        tableName='MileStones'
        headers={headers}
        data={rows}
        isPagination={false}
        actions={authState.user.role === 'admin' ? actions : []}
        emptyStateContent='No Milestone update'
        emptyStateButtonLabel={
          authState.user.role === 'NGO' ? 'Create New update' : 'No Updates Yet'
        }
        onEmptyStateButtonClick={
          authState.user.role === 'NGO' ? updateStatus : updateStatusD
        }
        currentPage={''}
        totalPages={''}
        onPageChange={''}
      />

      <ViewMileStoneUpdateModal
        open={isViewModalOpen}
        handleClose={() => setIsViewModalOpen(false)}
        milestoneUpdate={milestoneUpdateData}
      />
      <MileStoneUpdateModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        id={milestones && milestones[currentMilestone].id}
      />
    </>
  )
}

const mediaContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap' as 'wrap',
  justifyContent: 'center',
  gap: '20px'
}

const imageStyle = {
  width: '200px',
  height: '200px',
  objectFit: 'cover' as 'cover',
  borderRadius: '10px'
}

export default ProjectViewDetail

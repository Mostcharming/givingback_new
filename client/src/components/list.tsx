import { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import { Button, Col, Container, Row } from 'reactstrap'
import place from '../assets/images/project.png'

import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import cancel from '../assets/images/cancel.svg'
import useBackendService from '../services/backend_service'
import { useContent } from '../services/useContext'
import { formatDate } from './formatTime'
import Loading from './home/loading'

export const ProjectItem = (props: any) => {
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const { authState } = useContent()

  const enter = (event: React.MouseEvent<HTMLDivElement>) => setShow(true)
  const leave = (event: React.MouseEvent<HTMLDivElement>) => setShow(false)

  const edit = () => navigate(`/dashboard/projects/${props.project.id}/update`)

  const details = () => {
    if (props.type === 'past') {
      return props.onViewProject()
    } else {
      const role = authState.user?.role
      switch (role) {
        case 'admin':
          navigate(`/admin/project/${props.project.id}`)
          break
        case 'donor':
        case 'corporate':
          navigate(`/donor/project/${props.project.id}`)
          break
        case 'NGO':
          navigate(`/ngo/project/${props.project.id}`)
          break
        default:
          console.log('Invalid role or no role found')
      }
    }
    // if (props.type === 'admin') {
    //   return props.onViewProject()
    // }
    // if (props.type === 'donor') {
    //   return navigate(`/donor/projects/${props.project.id}/detail`)
    // }
    // props.type === 'past'
    //   ? navigate(`/ngo/past-projects/${props.project.id}/detail`)
    //   : navigate(`/ngo/projects/${props.project.id}/detail`)
  }

  const image = props.image ? `${props.image}` : place

  return (
    <Col className='px-3 mt-4' lg={4}>
      <div
        style={{
          borderRadius: '8px',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Image
            fluid={true}
            src={image}
            style={{
              width: '100%',
              height: '200px',
              borderRadius: '8px 8px 0px 0px',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          <div
            style={{
              visibility: show ? 'visible' : 'hidden',
              top: '0',
              width: '100%',
              height: '100%',
              borderRadius: '8px 8px 0px 0px',
              backgroundColor: '#0005',
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* <NavDropdown
              className="m-2"
              title={
                <span>
                  {" "}
                  <BiCog size="25" />
                </span>
              }
              style={{
                color: "white",
                float: "right",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <NavDropdown.Item className="m-auto" onClick={edit}>
                Edit
              </NavDropdown.Item>
              <NavDropdown.Item className="m-auto" onClick={details}>
                Campaign
              </NavDropdown.Item>
              <NavDropdown.Item className="m-auto text-danger">Deactivate</NavDropdown.Item>
            </NavDropdown> */}
            <div
              className='m-auto text-white rounded px-3'
              style={{ border: '2px solid white' }}
              onClick={details}
            >
              View Project
            </div>
          </div>
        </div>
        <div
          className='p-3'
          style={
            {
              // height: '400px'
            }
          }
        >
          <label className='mute' style={{ color: 'grey' }}>
            {props.project.status}
          </label>
          <h4 style={{ fontWeight: '500' }}>{props.project.title}</h4>
          <label className='pt-1'>{props.project.description}</label>
          <Row className='pt-2'>
            <Col md={6}>
              <label className='mute' style={{ color: 'grey' }}>
                Posted on:{' '}
              </label>
              <span className='fw-bold'>
                {' '}
                {formatDate(props.project.createdAt)}
              </span>
            </Col>
            <Col md={6}>
              {/* <label className="mute">Deadline</label> */}
              {/* <h6>{props.project.deadline}</h6> */}
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  )
}

const List = ({ type, donor = null }) => {
  const { authState, currentState } = useContent()
  const userId = authState.user?.id
  const [loading, setLoading] = useState(true)
  // const [mode, setMode] = useState(1);
  const [responseData, setResponseData] = useState([])
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalProjects, setTotalProjects] = useState(0)

  const { mutate: fetchUsers, isLoading } = useBackendService(
    '/allprojects',
    'GET',
    {
      onSuccess: (res: any) => {
        setResponseData(res.projects)
        setTotalProjects(res.totalItems || 0)
        setLoading(false)
      },
      onError: (error) => {
        setLoading(false)

        toast.error('Failed to fetch NGOs.')
      }
    }
  )
  useEffect(() => {
    let response: any = {}
    if (type === 'past') {
      fetchUsers({
        page: currentPage,
        projectType: 'previous',
        organization_id: currentState.user.id
      })
    } else {
      if (authState.user.role === 'NGO') {
        fetchUsers({
          page: currentPage,
          projectType: 'present',
          status: 'active',
          organization_id: currentState.user.id
        })
      } else {
        fetchUsers({
          page: currentPage,
          projectType: 'present',
          status: 'active',
          donor_id: currentState.user.id
        })
      }
    }
  }, [currentPage])

  const create = () => {
    navigate('/ngo/projects/add_past')
  }

  const nextPage = () => {
    if (currentPage * 6 < totalProjects) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className='pb-5'>
      {loading && <Loading type={'inline'} />}
      {responseData.length === 0 && !loading && (
        <div className='d-flex align-items-center justify-content-center m-auto'>
          <div className='text-center mt-4'>
            <h6 className='mb-3' style={{ fontSize: '16px' }}>
              You don’t have any projects currently
            </h6>
            <div className='d-flex flex-column align-items-center'>
              <img
                src={cancel}
                alt='cancel icon'
                width='30px'
                height='30px'
                className='mb-3'
              />
              {type === 'past' && (
                <Button
                  className='px-3 btn-custom text-white'
                  variant='primary'
                  type='button'
                  onClick={create}
                >
                  {'+ Add Past Project'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      {responseData.length > 0 && !loading && (
        <>
          <Container>
            <Row className='pt-5'>
              {responseData.map((project) => {
                let img
                if (type === 'past') {
                  img = project.projectImages[0]?.image
                }
                return (
                  <ProjectItem
                    type={type}
                    project={project}
                    image={img}
                    key={project.id}
                  />
                )
              })}
            </Row>
          </Container>

          <div className='d-flex justify-content-between mt-4'>
            <Button
              style={{
                backgroundColor: currentPage === 1 ? 'grey' : '#7B80DD',
                color: 'white',
                border: 'none',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
              onClick={previousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              style={{
                backgroundColor:
                  currentPage * 6 >= totalProjects ? 'grey' : '#7B80DD',
                color: 'white',
                border: 'none',
                cursor:
                  currentPage * 6 >= totalProjects ? 'not-allowed' : 'pointer'
              }}
              onClick={nextPage}
              disabled={currentPage * 6 >= totalProjects}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default List

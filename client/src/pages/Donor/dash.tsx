import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import Container from 'react-bootstrap/Container'
// import Button from 'react-bootstrap/Button'
// import Col from 'react-bootstrap/Col'
// import Row from 'react-bootstrap/Row'
// import Table from 'react-bootstrap/Table'
// import share from '../../../../images/share.svg'
// import database from '../../../../images/database.svg'
// import cancel from '../../../../images/cancel.svg'
// import megaphone from '../../../../images/megaphone 1.svg'
// import beneficiaries from '../../../../images/beneficiaries.svg'
// import { useSelector } from 'react-redux'
// import Loading from '../../../loading'
// import { RootState } from '../../../../store/reducers/index'
// import { connect, ConnectedProps } from 'react-redux'
// import { useDispatch } from 'react-redux'
// import { getCurrentUser } from '../../../../store/actions/allActions'
import { useDispatch } from 'react-redux'
import { Container } from 'reactstrap'
import { ThunkDispatch } from 'redux-thunk'
import Loading from '../../components/home/loading'
import { useContent } from '../../services/useContext'
import { RootState } from '../../types'
// import { Card } from 'react-bootstrap'
// import { getDashboard, getDOnorDashboard } from '../../../../utils/api'

function DonorDash() {
  const { currentState } = useContent()
  const current = currentState
  const [loading, setLoading] = useState(false)
  const [dashBoard, setDashBoard] = useState<any>({})

  const navigate = useNavigate()
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch()

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true)
  //     await dispatch(getCurrentUser())
  //     setLoading(false)
  //   }

  //   if (!current) {
  //     fetchData()
  //   }
  // }, [current, dispatch])

  // useEffect(() => {
  //   const getDashboardData = async () => {
  //     try {
  //       const res = await getDOnorDashboard()
  //       setDashBoard(res.data)
  //     } catch (error) {
  //       alert(error.message)
  //     }
  //   }
  //   getDashboardData()
  // }, [setDashBoard])

  const create = () => navigate('/donor/briefs')
  const name = current.user?.name

  const cardStyle = {
    borderRadius: '10px',
    border: '1px solid #7B80DD',
    borderBottom: '8px solid #7B80DD'
  }

  return (
    <>
      {loading && <Loading type={'full'} />}
      <Container className='mt-4'>
        {/*
        <Row className='mt-2'>
          <Col lg={3} md={6} className='p-2'>
            <Card style={cardStyle}>
              <Card.Body>
                <img src={share} alt='share icon' width={24} height={24} />
                <Card.Title className='mt-2' style={{ fontSize: '14px' }}>
                  Completed Projects
                </Card.Title>
                <Card.Text style={{ fontSize: '32px' }}>
                  {dashBoard.completedProjectsCount}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className='p-2'>
            <Card style={cardStyle}>
              <Card.Body>
                <img
                  src={megaphone}
                  alt='megaphone icon'
                  width={24}
                  height={24}
                />
                <Card.Title className='mt-2' style={{ fontSize: '14px' }}>
                  Ongoing Projects
                </Card.Title>
                <Card.Text style={{ fontSize: '32px' }}>
                  {dashBoard.activeProjectsCount}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className='p-2'>
            <Card style={cardStyle}>
              <Card.Body>
                <img
                  src={database}
                  alt='database icon'
                  width={24}
                  height={24}
                />
                <Card.Title className='mt-2' style={{ fontSize: '14px' }}>
                  Total Project Funding
                </Card.Title>
                <Card.Text style={{ fontSize: '32px' }}>
                  {dashBoard.totalDonations}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className='p-2'>
            <Card style={cardStyle}>
              <Card.Body>
                <img src={database} alt='share icon' width={24} height={24} />
                <Card.Title className='mt-2' style={{ fontSize: '14px' }}>
                  Wallet Balance
                </Card.Title>
                <Card.Text style={{ fontSize: '32px' }}>
                  {dashBoard.walletBalance}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row
          className='mt-4'
          style={{ background: 'white', padding: '20px', borderRadius: '8px' }}
        >
          <Col>
            <Card.Text style={{ fontSize: '32px' }}>Recent Projects</Card.Text>
            <Table responsive>
              <thead>
                <tr>
                  <th style={{ background: '#F0F1FB' }}>Project Title</th>
                  <th style={{ background: '#F0F1FB' }}>Description</th>
                  <th style={{ background: '#F0F1FB' }}>Amount</th>
                  <th style={{ background: '#F0F1FB' }}>Status</th>
                  <th style={{ background: '#F0F1FB' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashBoard.projects &&
                  dashBoard.projects.length > 0 &&
                  dashBoard.projects.map((project: any) => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>{project.description}</td>
                      <td>{project.amount}</td>
                      <td>{project.status}</td>
                      <td>{project.date}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {!dashBoard.projects && (
              // && dashBoard.projects.length === 0
              <div
                style={{ background: 'white', margin: 'auto' }}
                className='d-flex align-items-center justify-content-center mt-4'
              >
                <div style={{ background: 'white' }} className='text-center'>
                  <div className='d-flex'>
                    <img
                      src={cancel}
                      alt='cancel icon'
                      width='30px'
                      height='30px'
                      className='mr-3'
                    />
                    <Card.Text style={{ fontSize: '16px', color: 'black' }}>
                      No payment has been made so far. Create a project and
                      create funding campaigns for that project to receive
                      funding
                    </Card.Text>
                  </div>

                  <br />
                  <Button
                    className='px-3 btn-custom text-white'
                    variant='primary'
                    type='button'
                    onClick={create}
                  >
                    {'Create Project'}
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row> */}
      </Container>
    </>
  )
}

export default DonorDash

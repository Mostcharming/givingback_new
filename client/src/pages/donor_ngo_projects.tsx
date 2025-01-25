import { useState } from 'react'
import { Col, Container, Row } from 'reactstrap'
import List from '../components/list'
import { useContent } from '../services/useContext'
const DN_Projects = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const { authState } = useContent()

  return (
    <Container fluid>
      {authState.user?.role === 'NGO' ? (
        <Row className='project-header'>
          <Col
            xs={7}
            {...(currentTab === 0 && { className: 'active-tab' })}
            onClick={() => setCurrentTab(0)}
          >
            <label className='cursor-pointer'>Recent Projects</label>
          </Col>
          <Col
            xs={5}
            onClick={() => setCurrentTab(1)}
            {...(currentTab === 1 && { className: 'active-tab' })}
          >
            <label className='cursor-pointer'>Past Projects</label>
          </Col>
        </Row>
      ) : (
        <Row className='project-header'>
          <Col
            xs={7}
            {...(currentTab === 0 && { className: 'active-tab' })}
            onClick={() => setCurrentTab(0)}
          >
            <label className='cursor-pointer'>Recent Projects</label>
          </Col>
        </Row>
      )}

      {authState.user?.role === 'NGO' ? (
        <>
          {currentTab === 0 && <List type={'new'} />}
          {currentTab === 1 && <List type={'past'} />}
        </>
      ) : (
        <List type={'new'} />
      )}
    </Container>
  )
}
export default DN_Projects

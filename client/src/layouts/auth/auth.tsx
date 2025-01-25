import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import backgroundImage from '../../assets/images/background.jpg'
import AuthNavbar from '../../components/auth/authNav'
import routes from '../../routes/routes'
import { useLoadStyles } from '../../services/styles'

const Auth = (props) => {
  useLoadStyles(['argon'])

  const mainContent = React.useRef(null)
  const location = useLocation()

  React.useEffect(() => {
    document.body.classList.add('bg-default')
    return () => {
      document.body.classList.remove('bg-default')
    }
  }, [])
  React.useEffect(() => {
    document.documentElement.scrollTop = 0
    document.scrollingElement.scrollTop = 0
    mainContent.current.scrollTop = 0
  }, [location])

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === '/auth') {
        return <Route path={prop.path} element={prop.component} key={key} />
      } else {
        return null
      }
    })
  }

  return (
    <>
      <div
        className='main-content'
        ref={mainContent}
        style={{
          minHeight: '100vh',
          background: `linear-gradient(87deg, rgba(123, 128, 221, 0) 0, rgba(159, 128, 221, 0.4) 100%), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <AuthNavbar sign={false} />
        <div className='header bg-gradient-info py-5 py-lg-6'>
          <Container>
            <div className='header-body text-center mb-7'>
              <Row className='justify-content-center'>
                <Col lg='5' md='6'>
                  <h1 style={{ color: 'black' }}>Welcome!</h1>
                  <p className='text-lead' style={{ color: 'black' }}>
                    Login to your GivingBack Account
                  </p>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
        {/* Page content */}
        <Container className='mt--8 pb-5'>
          <Row className='justify-content-center'>
            <Routes>
              {getRoutes(routes)}
              <Route path='*' element={<Navigate to='/error' replace />} />
            </Routes>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default Auth

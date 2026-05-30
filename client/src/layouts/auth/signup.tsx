import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import backgroundImage from '../../assets/images/background.jpg'
import AuthNavbar from '../../components/auth/authNav'
import routes from '../../routes/routes'
import { useLoadStyles } from '../../services/styles'

const Signup = (props) => {
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
      if (prop.layout === '/signup') {
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
        <AuthNavbar sign />
        <Routes>
          {getRoutes(routes)}
          <Route path='*' element={<Navigate to='/error' replace />} />
        </Routes>
      </div>
    </>
  )
}

export default Signup

/* eslint-disable @typescript-eslint/no-explicit-any */
// Libraries and Utilities
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layouts and Pages
import Auth from './layouts/auth/auth'
import Dashboard from './layouts/dashboard/layout'
import About from './pages/home/about'
import Aml from './pages/home/aml'
import Contact from './pages/home/contact'
import Index from './pages/home/home'
import LatestProject from './pages/home/latest-project'
import PrivacyPolicy from './pages/home/policy'
import ProjectDetails from './pages/home/project-details'
import Services from './pages/home/services'
import Terms from './pages/home/terms'

// Services and Context
import Signup from './layouts/auth/signup'
import Error from './pages/error'
import PreviousIndex from './pages/home/previous'
import useBackendService from './services/backend_service'
import { useContent } from './services/useContext'
import { getCurrent } from './store/reducers/userReducer'

// ProtectedRoute Component
function ProtectedRoute({ element, roles, authState }) {
  const { isAuthenticated, user } = authState || {};
  const userRole = user?.role?.toLowerCase();
  const userStatus = user?.status;

  if (!isAuthenticated || !user) {
    return <Navigate to='/' replace />;
  }

  if (!userStatus) {
    return <Navigate to='/auth/verify' replace />;
  }

  if (roles?.includes(userRole)) {
    return element;
  }

  return <Navigate to='/' replace />;
}

// DashboardRoute Component
function DashboardRoute({ authState }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { mutate: fetchCurrentUser } = useBackendService('/auth', 'GET', {
    onSuccess: (response: any) => {
      dispatch(getCurrent(response))
      redirectToDashboard(authState.user?.role)
    },
    onError: (error) => {
      handleAuthError(error, authState.user?.role)
    }
  })

  const redirectToDashboard = (role) => {
    const userRole = role?.toLowerCase()

    switch (userRole) {
      case 'ngo':
        navigate('/ngo/dashboard')
        break
      case 'admin':
        navigate('/admin/dashboard')
        break
      case 'donor':
      case 'corporate':
        navigate('/donor/dashboard')
        break
      default:
        navigate('/')
    }
  }

  const handleAuthError = (error, role) => {
    if (
      error.response?.data?.error === 'User not associated with any account'
    ) {
      if (role === 'NGO') {
        navigate('/signup/organization', { replace: true })
      } else if (role === 'donor' || role === 'corporate') {
        navigate('/signup/donor', { replace: true })
      } else {
        redirectToDashboard(authState.user?.role)
      }
    }
  }

  useEffect(() => {
    if (authState?.isAuthenticated && authState.user?.status === 1) {
      fetchCurrentUser({})
    } else if (authState?.isAuthenticated && authState.user?.status === 0) {
      navigate('/auth/verify', { replace: true })
    } else navigate('/')
  }, [authState, fetchCurrentUser, navigate])

  return null
}

// App Component
function App() {
  const { authState } = useContent()

  return (
    <>
      <ToastContainer
        position='top-right'
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Public Routes */}
        <Route path='/*' element={<HomeRoutes />} />
        <Route path='/auth/*' element={<Auth />} />
        <Route path='/signup/*' element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute
              element={<Dashboard compare='/admin' />}
              roles={['admin']}
              authState={authState}
            />
          }
        />
        <Route
          path='/donor/*'
          element={
            <ProtectedRoute
              element={<Dashboard compare='/donor' />}
              roles={['donor', 'corporate']}
              authState={authState}
            />
          }
        />
        <Route
          path='/ngo/*'
          element={
            <ProtectedRoute
              element={<Dashboard compare='/ngo' />}
              roles={['ngo']}
              authState={authState}
            />
          }
        />
        <Route
          path='/dashboard'
          element={<DashboardRoute authState={authState} />}
        />

        {/* Error Route */}
        <Route path='/error' element={<Error />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </>
  )
}

export default App

// HomeRoutes Component (in ./pages/home/HomeRoutes.js)
export function HomeRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Index />} />
      <Route path='/previous' element={<PreviousIndex />} />
      <Route path='/aml' element={<Aml />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/about_us' element={<About />} />
      <Route path='/services' element={<Services />} />
      <Route path='/policy' element={<PrivacyPolicy />} />
      <Route path='/terms' element={<Terms />} />
      <Route path='/project-details' element={<ProjectDetails />} />
      <Route path='/latest-projects' element={<LatestProject />} />
    </Routes>
  )
}

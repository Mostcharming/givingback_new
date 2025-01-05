import { ThunkDispatch } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Auth from './layouts/auth/auth'
import Dashboard from './layouts/dashboard/layout'
import Error from './pages/error'
import About from './pages/home/about'
import Aml from './pages/home/aml'
import Contact from './pages/home/contact'
import Index from './pages/home/home'
import LatestProject from './pages/home/latest-project'
import PrivacyPolicy from './pages/home/policy'
import ProjectDetails from './pages/home/project-details'
import Services from './pages/home/services'
import Terms from './pages/home/terms'
import useBackendService from './services/backend_service'
import { useContent } from './services/useContext'
import { getCurrent } from './store/reducers/userReducer'
import { RootState } from './types'

function ProtectedRoute({
  element,
  roles,
  authState
}: {
  element: JSX.Element
  roles: string[]
  authState: any
}) {
  // Verify the role you're checking against

  if (!authState?.isAuthenticated || !authState?.user) {
    return <Navigate to='/' replace />
  }

  const userStatus = authState.user.status
  const userRole = authState.user.role

  if (userStatus === 0 || userStatus === false) {
    return <Navigate to='/auth/verify' replace />
  }

  if (roles.includes(userRole.toLowerCase())) {
    return element
  }

  return <Navigate to='/' replace />
}

function DashboardRoute({ authState }: { authState: any }) {
  const dispatch: ThunkDispatch<RootState, unknown, any> = useDispatch()
  const { mutate: getCurrentD } = useBackendService('/auth', 'GET', {
    onSuccess: (response: any) => {
      dispatch(getCurrent(response))
    },
    onError: (error: any) => {
      toast.error(error.response.data.error)
    }
  })
  useEffect(() => {
    if (authState?.isAuthenticated) {
      getCurrentD({})
    }
  }, [authState])
  if (!authState?.isAuthenticated || !authState?.user) {
    return <Navigate to='/' replace />
  }

  const userRole = authState.user.role.toLowerCase()

  switch (userRole) {
    case 'ngo':
      return <Navigate to='/ngo/dashboard' replace />
    case 'admin':
      return <Navigate to='/admin/dashboard' replace />
    case 'donor':
    case 'corporate':
      return <Navigate to='/donor/dashboard' replace />
    default:
      return <Navigate to='/' replace />
  }
}

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
        <Route path='/' element={<Index />} />
        <Route path='/aml' element={<Aml />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/about_us' element={<About />} />
        <Route path='/services' element={<Services />} />
        <Route path='/policy' element={<PrivacyPolicy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/project-details' element={<ProjectDetails />} />
        <Route path='/latest-projects' element={<LatestProject />} />
        <Route path='/auth/*' element={<Auth />} />

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
        <Route
          path='/auth/verify'
          element={
            authState?.isAuthenticated && authState?.user?.status === 1 ? (
              <DashboardRoute authState={authState} />
            ) : (
              <Auth />
            )
          }
        />

        <Route path='*' element={<Error />} />
      </Routes>
    </>
  )
}

export default App

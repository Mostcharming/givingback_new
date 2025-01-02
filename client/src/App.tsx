import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Index from './pages/home'
import { useContent } from './services/useContext'

function ProtectedRoute({
  element,
  roles,
  authState
}: {
  element: JSX.Element
  roles: string[]
  authState: any
}) {
  if (!authState?.isAuthenticated || !authState?.user) {
    return <Navigate to='/' replace />
  }

  const userRole = authState.user.role.toLowerCase()
  if (roles.includes(userRole)) {
    return element
  }

  return <Navigate to='/' replace />
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
        <Route
          path='/auth/*'
          element={
            <ProtectedRoute
              element={<Index />}
              roles={['admin', 'donor', 'corporate', 'ngo']}
              authState={authState}
            />
          }
        />
        <Route
          path='/admin/*'
          element={
            <ProtectedRoute
              element={<Index />}
              roles={['admin']}
              authState={authState}
            />
          }
        />
        <Route
          path='/donor/*'
          element={
            <ProtectedRoute
              element={<Index />}
              roles={['donor', 'corporate']}
              authState={authState}
            />
          }
        />
        <Route
          path='/ngo/*'
          element={
            <ProtectedRoute
              element={<Index />}
              roles={['ngo']}
              authState={authState}
            />
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  )
}

export default App

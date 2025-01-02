import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Index from './pages/home'

function App() {
  // const { authState } = useContent()
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
        <Route path='/auth/*' element={<Index />} />
        <Route path='/admin/*' element={<Index />} />
        <Route path='/donor/*' element={<Index />} />
        <Route path='/ngo/*' element={<Index />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  )
}

export default App

import { useContent } from './services/useContext'

function App() {
  const { authState } = useContent()
  return (
    <>
      <div>{authState.isAuthenticated.toString()}</div>
    </>
  )
}

export default App

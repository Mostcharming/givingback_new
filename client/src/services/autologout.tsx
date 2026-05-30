import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout_auth } from '../store/reducers/authReducer'
import { useContent } from './useContext'

const AutoLogout: React.FC = () => {
  const { authState } = useContent()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onlineCheckInterval = useRef<NodeJS.Timeout | null>(null)
  let inactivityTimer: NodeJS.Timeout | undefined
  let awayTimer: NodeJS.Timeout | undefined

  const resetTimers = (): void => {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    if (awayTimer) clearTimeout(awayTimer)

    inactivityTimer = setTimeout(() => {
      handleLogout()
    }, 3 * 60 * 60 * 1000)

    awayTimer = setTimeout(() => {
      handleLogout()
    }, 3 * 60 * 60 * 1000)
  }

  const checkOnlineStatus = (): void => {
    if (navigator.onLine) {
      localStorage.setItem('lastOnline', Date.now().toString())
    } else {
      const lastOnline = parseInt(localStorage.getItem('lastOnline') || '0', 10)
      const offlineDuration = Date.now() - lastOnline

      if (offlineDuration >= 3 * 60 * 60 * 1000) {
        handleLogout()
      }
    }
  }

  const handleLogout = (): void => {
    dispatch(logout_auth())
    navigate('/')
  }

  useEffect(() => {
    if (authState.isAuthenticated) {
      resetTimers()
      checkOnlineStatus()

      onlineCheckInterval.current = setInterval(checkOnlineStatus, 60 * 1000)

      window.addEventListener('mousemove', resetTimers)
      window.addEventListener('keydown', resetTimers)
      window.addEventListener('mousedown', resetTimers)
      window.addEventListener('touchstart', resetTimers)

      return () => {
        window.removeEventListener('mousemove', resetTimers)
        window.removeEventListener('keydown', resetTimers)
        window.removeEventListener('mousedown', resetTimers)
        window.removeEventListener('touchstart', resetTimers)

        if (inactivityTimer) clearTimeout(inactivityTimer)
        if (awayTimer) clearTimeout(awayTimer)
        if (onlineCheckInterval.current)
          clearInterval(onlineCheckInterval.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuthenticated])

  return null
}

export default AutoLogout

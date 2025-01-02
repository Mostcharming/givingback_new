import { useSelector } from 'react-redux'
import { RootState } from '../types'

export const useContent = () => {
  const authState = useSelector((state: RootState) => state.auth)
  return { authState }
}

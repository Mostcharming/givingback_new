import { combineReducers, Reducer } from 'redux'
import authReducer, { AuthState } from './authReducer'
import currentReducer, { CurrentState } from './userReducer'

interface RootState {
  auth: AuthState
  current: CurrentState
}

const rootReducer: Reducer<RootState> = combineReducers({
  auth: authReducer,
  current: currentReducer
})

export default rootReducer
export type { RootState }

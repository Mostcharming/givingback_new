import { combineReducers, Reducer } from 'redux'
import { RootState } from '../../types'
import authReducer from './authReducer'

const rootReducer: Reducer<RootState> = combineReducers({
  auth: authReducer
})

export default rootReducer

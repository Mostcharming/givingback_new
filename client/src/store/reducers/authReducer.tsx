import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from '../../types'

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signup: (state, action: PayloadAction<{ token: any; data: any }>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.data.user
    },
    login: (state, action: PayloadAction<{ token: any; data: any }>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.data.user
    },

    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.user = null
    }
  }
})

export const { login, logout, signup } = authSlice.actions
export default authSlice.reducer
export type { AuthState }

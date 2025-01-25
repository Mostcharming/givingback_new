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
    signup_auth: (state, action: PayloadAction<{ token: any; data: any }>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.data.user
    },
    login_auth: (state, action: PayloadAction<{ token: any; data: any }>) => {
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.data.user
    },

    logout_auth: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.user = null
    },
    update_user_status: (state) => {
      if (state.user) {
        state.user.status = 1
      }
    },
    clearAuthState: () => initialState
  }
})

export const {
  login_auth,
  logout_auth,
  signup_auth,
  update_user_status,
  clearAuthState
} = authSlice.actions
export default authSlice.reducer
export type { AuthState }

import { Request } from 'express'

export interface FullUser {
  id: string
  email: string
  password?: string
  role?: string
  status?: number
  active: number
  token?: number
}

export interface User {
  id: number
  role: string
}
export interface MulterRequest extends Request {
  file: any
}
export interface UserRequest extends Request {
  body: {
    uuid?: string
    email: string
    password: string
    otp: number
    oldPassword: string
    newPassword: string
  }
  cookies: {
    giveback?: string
  }
  user?: User
}
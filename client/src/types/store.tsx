import { User } from './user'

export interface UserImage {
  id: number
  filename: string
  user_id: number
}
export interface Wallet {
  wallet_id: number
  user_id: number
  balabce: number
  currency: string
}

interface Bank {
  bankName: string
  accountName: string
  accountNumber: string
  bvn: number | null
}

interface Address {
  state: string
  city_lga: string
  address: string
}

export interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: User | null
}
interface CurrentState {
  activeProjectsCount: number
  allProjectsCount: number
  donationsCount: number
  bank: Bank[] | null
  address: Address[] | null
  user: User | null
  userimage: UserImage | null
  wallet: Wallet | null
}
export interface RootState {
  auth: AuthState
  current: CurrentState
}

import { Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '../reducers/index'
import * as API from '../../utils/api'
import { counterActions } from '../reducers/authReducer'
import { getCurrent } from '../reducers/userReducer'
import { Organization } from '../../types/types'
import { toast } from 'react-toastify'

export const login = (
  email: string,
  password: string,
  uuid: string
): ThunkAction<any, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await API.login(email, password, uuid)
      dispatch(counterActions.login(res.data))
    } catch (error: any) {
      toast.error('Invalid Login Details')
      throw error
    }
  }
}
export const verify = (
  otp: string
): ThunkAction<any, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await API.verify(otp)
      toast.success(res.data)
      dispatch(counterActions.afterVerification(1))
    } catch (error: any) {
      toast.error('Invalid OTP')
      throw error
    }
  }
}
export const signup = (
  email: string,
  password: string,
  uuid: string
): ThunkAction<any, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await API.signup(email, password, uuid)
      dispatch(counterActions.signup(res.data))
    } catch (error: any) {
      toast.error('User already exists')
      throw error
    }
  }
}
export const INDcreate = (
  firstname: string,
  lastname: string,
  nin_ssn: string,
  state: string,
  city_lga: string,
  address: string,
  id: File
): ThunkAction<any, RootState, unknown, any> => {
  return async () => {
    try {
      await API.INDcreate(
        firstname,
        lastname,
        nin_ssn,
        state,
        city_lga,
        address
      )

      await API.GovId(id)
    } catch (error: any) {
      toast.error('Error creating Profile')
      throw error
    }
  }
}
export const IndBank = (
  firstName: string,
  lastName: string,
  bankName: string,
  accountNumber: string
): ThunkAction<any, RootState, unknown, any> => {
  return async () => {
    try {
      await API.IndNuban(firstName, lastName, bankName, accountNumber)
    } catch (error: any) {
      console.log(error)
      toast.error('Invalid Bank Account')
      throw error
    }
  }
}
export const userPic = (
  photo: File
): ThunkAction<any, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      const ind: any = 'user'
      await API.userPic(photo)
      dispatch(counterActions.afterInd(ind))
    } catch (error: any) {
      toast.error('Error Uploading Image')
      throw error
    }
  }
}
export const createOrganization = (
  organization: Organization
): ThunkAction<any, RootState, unknown, any> => {
  return async dispatch => {
    try {
      await API.createOrganization(organization)
      dispatch(counterActions.afterInd({ ind: 'NGO' }))
    } catch (error: any) {
      toast.error(error.response.data.error)
      throw error
    }
  }
}
export const ppCreate = (
  name: string,
  description: string,
  id: File
): ThunkAction<any, RootState, unknown, any> => {
  return async () => {
    try {
      await API.ppCreate(name, description)

      await API.ppImage(id)
    } catch (error: any) {
      console.log(error)
      throw error
    }
  }
}
export const orgBank = (
  firstName: string,
  lastName: string,
  bankName: string,
  accountNumber: string
): ThunkAction<any, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      const ind: any = 'user'
      await API.orgNuban(firstName, lastName, bankName, accountNumber)
      dispatch(counterActions.afterInd(ind))
    } catch (error: any) {
      console.log(error)
      toast.error('Invalid Bank Account')
      throw error
    }
  }
}
export const getCurrentUser = (): ThunkAction<any, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await API.current()
      dispatch(getCurrent(res.data))
    } catch (error: any) {
      if (error.response.status === 404) {
        dispatch(
          getCurrent({
            bank: null,
            address: null,
            user: null,
            activeProjectsCount: 0,
            allProjectsCount: 0,
            donationsCount: 0,
            userimage: null,
            wallet: null
          })
        )
      }
    }
  }
}
export const logout = (): ThunkAction<any, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      await API.logout()
      dispatch(counterActions.logout())
    } catch (error: any) {
      console.log(error)
      throw error
    }
  }
}
export const getPreviousProjects = (): ThunkAction<
  any,
  RootState,
  unknown,
  any
> => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await API.getPreviousProjects()
      return res.data
    } catch (error: any) {
      console.log(error)
      throw error
    }
  }
}
export const getPreviousProject = (
  id: number
): ThunkAction<any, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await API.getPreviousProject(id)
      return res
    } catch (error: any) {
      console.log(error)
      throw error
    }
  }
}
export const updateP = (
  title: string,
  category: string,
  cost: string,
  beneficiary: string,
  duration: string,
  description: string,
  id: string
): ThunkAction<any, RootState, unknown, any> => {
  return async () => {
    try {
      await API.updateP(
        title,
        category,
        cost,
        beneficiary,
        duration,
        description,
        id
      )
    } catch (error: any) {
      console.log(error)
      throw error
    }
  }
}

export const createP = (
  title: string,
  category: string,
  cost: string,
  beneficiary: string,
  duration: string,
  description: string
): ThunkAction<any, RootState, unknown, any> => {
  return async () => {
    try {
      await API.createP(
        title,
        category,
        cost,
        beneficiary,
        duration,
        description
      )
    } catch (error: any) {
      console.log(error)
      toast.error('Error creating project')
      throw error
    }
  }
}
export const addPastProject = (
  project: any,
  images
): ThunkAction<any, RootState, unknown, any> => {
  return async (dispatch: Dispatch) => {
    try {
      await API.addPastProjectCall(project, images)
      // dispatch(counterActions.addPastProject(project));
    } catch (error: any) {
      console.log(error)
      throw error
    }
  }
}

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const getBaseURL = (): string => {
  switch (import.meta.env.VITE_NODE_ENV) {
    case 'production':
      return 'https://givebackng.org/rest/v1'
    case 'development':
      return 'http://localhost:5000/rest/v1'

    default:
      return ''
  }
}

const baseURL = getBaseURL()

interface BackendServiceConfig extends AxiosRequestConfig {
  headers?: {
    Authorization?: string
    'Content-Type'?: string
  }
}

const useBackendService = <TData, TError>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options: UseMutationOptions<TData, TError, any, unknown> = {}
): UseMutationResult<TData, TError, any, unknown> => {
  const { token } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const url = baseURL + endpoint

  const backendService = async (
    payload: any,
    config: BackendServiceConfig = {}
  ): Promise<TData> => {
    const lowerCaseMethod = method.toLowerCase()

    const headers = {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : undefined
    }

    if (payload instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data'
    }

    config.headers = headers

    switch (lowerCaseMethod) {
      case 'get':
        const getResponse: AxiosResponse<TData> = await axios.get(url, {
          params: payload,
          ...config
        })
        return getResponse.data
      case 'post':
        const postResponse: AxiosResponse<TData> = await axios.post(
          url,
          payload,
          config
        )
        return postResponse.data
      case 'put':
        const putResponse: AxiosResponse<TData> = await axios.put(
          url,
          payload,
          config
        )
        return putResponse.data
      case 'delete':
        const deleteResponse: AxiosResponse<TData> = await axios.delete(url, {
          data: payload,
          ...config
        })
        return deleteResponse.data
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
  }

  const enhancedOptions = {
    ...options,
    onError: (error: any) => {
      if (!navigator.onLine) {
        toast.error(
          'No internet connection. Please check your network and try again.'
        )
        return
      }

      const errorMessage = error.response?.data?.message?.toLowerCase()
      if (errorMessage && errorMessage.includes('unauthorized')) {
        toast.error('Session expired. Please log in again.')
        dispatch(logout())
        navigate('/')
        return
      }

      if (options.onError) {
        options.onError(error)
      }
    }
  }

  return useMutation(backendService, enhancedOptions)
}

export default useBackendService
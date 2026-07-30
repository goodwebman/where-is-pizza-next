import type { Session } from '@/src/entities/session/model/types'
import axios from 'axios'
import { getReduxDispatch, getReduxState } from '../../lib/helpers/redux'


export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  timeout: 8000,
  withCredentials: true,
})

let isRefreshing = false
let refreshPromise: Promise<Session> | null = null



axiosInstance.interceptors.request.use(config => {
  const state = getReduxState()

  const token =
    state?.session?.type === 'authorized'
      ? state.session.session.token
      : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})



axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      if (!isRefreshing) {
        isRefreshing = true

        const dispatch = getReduxDispatch()

        if (!dispatch) {
          // On the server, no Redux — can't refresh
          isRefreshing = false
          return Promise.reject(error)
        }

        // Dynamic import to break the circular dep:
        // thunks → api → api-client → thunks (refreshSession)
        const { refreshSession } = await import(
          '@/src/entities/session/model/thunks'
        )
        refreshPromise = dispatch(refreshSession()).unwrap()
      }

      const data = await refreshPromise

      isRefreshing = false
      refreshPromise = null

      if (!data) return Promise.reject(error)

      original.headers.Authorization = `Bearer ${data.token}`

      return axiosInstance(original)
    } catch  {
      isRefreshing = false
      refreshPromise = null

      return Promise.reject(error)
    }
  }
)
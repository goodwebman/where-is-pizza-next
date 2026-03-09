import axios from 'axios'
import { refreshSession } from '@/src/entities/session/model/thunks'
import { getReduxDispatch, getReduxState } from '../../lib/helpers/redux'


export const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 8000,
  withCredentials: true,
})

let isRefreshing = false
let refreshPromise: Promise<any> | null = null



axiosInstance.interceptors.request.use(config => {
  const state = getReduxState()

  const token =
    state.session.type === 'authorized'
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

        refreshPromise = dispatch(refreshSession()).unwrap()
      }

      const data = await refreshPromise

      isRefreshing = false
      refreshPromise = null

      original.headers.Authorization = `Bearer ${data.token}`

      return axiosInstance(original)
    } catch (e) {
      isRefreshing = false
      refreshPromise = null

      return Promise.reject(error)
    }
  }
)
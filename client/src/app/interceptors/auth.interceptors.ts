import { refreshUser } from '@/src/entities/user/model/thunks'
import { axiosInstance } from '@/src/shared/api/axios/api-client'
import { store } from '@/src/shared/store/redux-store'


axiosInstance.interceptors.request.use(config => {
  const state = store.getState()

  const token =
    state.auth.type === 'succeeded'
      ? state.auth.user.token
      : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  r => r,
  async error => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      const result = await store.dispatch(refreshUser())

      if (refreshUser.fulfilled.match(result)) {
        original.headers.Authorization = `Bearer ${result.payload.token}`
        return axiosInstance(original)
      }
    }

    return Promise.reject(error)
  }
)

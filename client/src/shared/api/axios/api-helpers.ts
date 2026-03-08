import { AxiosRequestConfig } from 'axios'
import { axiosInstance } from './api-client'

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const { data } = await axiosInstance.get<T>(url, config)
    return data
  },

  post: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ) => {
    const { data } = await axiosInstance.post<T>(url, body, config)
    return data
  },

  put: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ) => {
    const { data } = await axiosInstance.put<T>(url, body, config)
    return data
  },

  patch: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ) => {
    const { data } = await axiosInstance.patch<T>(url, body, config)
    return data
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const { data } = await axiosInstance.delete<T>(url, config)
    return data
  },
}
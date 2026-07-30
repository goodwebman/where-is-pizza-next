import type { AxiosRequestConfig } from 'axios'
import type { z } from 'zod'
import { axiosInstance } from './api-client'
import { validateResponse } from '../../lib/helpers/validation/validate-response'

type WithSchema<T> = { schema?: z.ZodType<T> }

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig & WithSchema<T>) => {
    const { data } = await axiosInstance.get<T>(url, config)
    return validateResponse(data, config?.schema)
  },

  post: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig & WithSchema<T>,
  ) => {
    const { data } = await axiosInstance.post<T>(url, body, config)
    return validateResponse(data, config?.schema)
  },

  put: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig & WithSchema<T>,
  ) => {
    const { data } = await axiosInstance.put<T>(url, body, config)
    return validateResponse(data, config?.schema)
  },

  patch: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig & WithSchema<T>,
  ) => {
    const { data } = await axiosInstance.patch<T>(url, body, config)
    return validateResponse(data, config?.schema)
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig & WithSchema<T>) => {
    const { data } = await axiosInstance.delete<T>(url, config)
    return validateResponse(data, config?.schema)
  },
}
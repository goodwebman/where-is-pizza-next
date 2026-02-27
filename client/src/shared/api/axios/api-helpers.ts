import { axiosInstance } from './api-client';

export const api = {
  get: async <T>(url: string) => {
    const { data } = await axiosInstance.get<T>(url);
    return data;
  },

  post: async <T>(url: string, body?: unknown) => {
    const { data } = await axiosInstance.post<T>(url, body);
    return data;
  },

  put: async <T>(url: string, body?: unknown) => {
    const { data } = await axiosInstance.put<T>(url, body);
    return data;
  },

  patch: async <T>(url: string, body?: unknown) => {
    const { data } = await axiosInstance.patch<T>(url, body);
    return data;
  },

  delete: async <T>(url: string) => {
    const { data } = await axiosInstance.delete<T>(url);
    return data;
  },
};

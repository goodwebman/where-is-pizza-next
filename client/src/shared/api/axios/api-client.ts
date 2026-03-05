
import axios from 'axios';
import { store } from '@/src/shared/store/redux-store';
import { refreshSession } from '@/src/entities/session';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 8000,
  withCredentials: true,
});


axiosInstance.interceptors.request.use(config => {
  const state = store.getState();
  const token =
    state.session.type === 'authorized' ? state.session.session.token : null;

 

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log('Request headers before send:', config.headers);
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const result = await store.dispatch(refreshSession());

        if (refreshSession.fulfilled.match(result)) {
          const newToken = result.payload.token;

          console.log('Token refreshed:', newToken);

          original.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(original);
        }
      } catch (e) {
        console.error('Refresh token failed:', e);
      }
    }

    return Promise.reject(error);
  },
);
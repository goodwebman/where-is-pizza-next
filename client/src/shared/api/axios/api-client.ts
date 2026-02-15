import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 8000,
  withCredentials: true,
});

import 'client-only';

import axios from 'axios';

export const axiosInstance = axios.create({
  // Same-origin: the API lives in this app under /api. A relative baseURL only
  // works in the browser, which is intentional — Server Components must call
  // the service layer directly instead of looping back over HTTP.
  baseURL: '/api',
  timeout: 8000,
  withCredentials: true,
});

/**
 * Single-flight refresh: several requests failing with 401 at once share one
 * refresh call and then retry.
 *
 * There is no request interceptor any more. Credentials travel as httpOnly
 * cookies, so nothing has to read a token out of Redux — which is what forced
 * the previous version to dynamically import thunks to break an import cycle,
 * and to give up entirely during server rendering.
 */
let refreshPromise: Promise<unknown> | null = null;

const refreshSession = () => {
  refreshPromise ??= axiosInstance.post('/auth/refresh').finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;

    const isAuthCall = typeof original?.url === 'string' &&
      original.url.startsWith('/auth/');

    // Never try to refresh a failing refresh, and never retry twice.
    if (error.response?.status !== 401 || original?._retry || isAuthCall) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      await refreshSession();
    } catch {
      // Refresh failed: the session is genuinely gone, surface the original 401.
      return Promise.reject(error);
    }

    return axiosInstance(original);
  },
);

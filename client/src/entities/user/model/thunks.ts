import { api } from '@/src/shared/api/axios/api-helpers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { LoginData, RegisterData, User } from './types';

export const registerUser = createAsyncThunk<User, RegisterData>(
  'auth/register',
  async data => {
    const res = await api.post<{ token: string; username: string }>(
      '/auth/register',
      data,
    );

    return { token: res.token, username: res.username };
  },
);

export const loginUser = createAsyncThunk<User, LoginData>(
  'auth/login',
  async data => {
    const res = await api.post<{ token: string; username: string }>(
      '/auth/login',
      data,
    );

    return { token: res.token, username: res.username };
  },
);

export const refreshUser = createAsyncThunk<User>('auth/refresh', async () => {
  const res = await api.post<{ token: string; username: string }>(
    '/auth/refresh',
  );

  return { token: res.token, username: res.username };
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
  return true;
});

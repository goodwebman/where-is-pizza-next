import { api } from '@/src/shared/api/axios/api-helpers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  AuthResponse,
  LoginData,
  RefreshResponse,
  RegisterData,
  Session,
} from './types';

export const loginSession = createAsyncThunk<Session, LoginData>(
  'session/login',
  async data => {
    return await api.post<AuthResponse>('/auth/login', data);
  }
);

export const registerSession = createAsyncThunk<Session, RegisterData>(
  'session/register',
  async data => {
    return await api.post<AuthResponse>('/auth/register', data);
  }
);

export const refreshSession = createAsyncThunk<Session>(
  'session/refresh',
  async () => {
    return await api.post<RefreshResponse>('/auth/refresh');
  }
);

export const logoutSession = createAsyncThunk(
  'session/logout',
  async () => {
    await api.post('/auth/logout');
    return true;
  }
);
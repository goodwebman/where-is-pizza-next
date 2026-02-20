import { createSlice } from '@reduxjs/toolkit';
import {
  loginSession,
  logoutSession,
  refreshSession,
  registerSession,
} from './thunks';
import type { SessionState } from './types';

const initialState: SessionState = { type: 'idle' };

export const sessionSlice = createSlice({
  name: 'session',
  initialState: initialState as SessionState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginSession.pending, () => ({ type: 'pending' }))
      .addCase(loginSession.fulfilled, (_, action) => ({
        type: 'authorized',
        session: action.payload,
      }))
      .addCase(loginSession.rejected, (_, action) => ({
        type: 'failed',
        error: action.error.message || 'Login failed',
      }))
      .addCase(registerSession.fulfilled, (_, action) => ({
        type: 'authorized',
        session: action.payload,
      }))
      .addCase(refreshSession.fulfilled, (_, action) => ({
        type: 'authorized',
        session: action.payload,
      }))
      .addCase(logoutSession.fulfilled, () => ({ type: 'idle' }));
  },
});

export default sessionSlice.reducer;

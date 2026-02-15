import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser, refreshUser, registerUser } from './thunks';
import type { AuthState, User } from './types';

const initialState: AuthState = { type: 'idle' };

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState as AuthState,
  reducers: {},

  extraReducers: builder => {
    builder

      .addCase(registerUser.pending, () => ({ type: 'pending' }))
      .addCase(registerUser.fulfilled, (_, action: PayloadAction<User>) => ({
        type: 'succeeded',
        user: action.payload,
      }))
      .addCase(registerUser.rejected, (_, action) => ({
        type: 'failed',
        error: action.error.message || 'Register failed',
      }))

      .addCase(loginUser.pending, () => ({ type: 'pending' }))
      .addCase(loginUser.fulfilled, (_, action: PayloadAction<User>) => ({
        type: 'succeeded',
        user: action.payload,
      }))
      .addCase(loginUser.rejected, (_, action) => ({
        type: 'failed',
        error: action.error.message || 'Login failed',
      }))

      .addCase(refreshUser.fulfilled, (_, action) => ({
        type: 'succeeded',
        user: action.payload,
      }))

      .addCase(logoutUser.fulfilled, () => ({ type: 'idle' }));
  },
});

export default authSlice.reducer;

'use client';

import { useAppDispatch } from '@/src/shared/store/redux-store';
import { loginSession, type LoginData } from '../model';
import { useCallback } from 'react';

export const useLogin = () => {
  const dispatch = useAppDispatch();

  const login = useCallback(async (data: LoginData) => {
    const result = await dispatch(loginSession(data));
    return result;
  }, [dispatch]);

  return { login };
};
'use client';

import { useAppDispatch } from '@/src/shared/store/redux-store';
import { useCallback } from 'react';
import { loginSession, type LoginData } from '../model';

export const useLogin = () => {
  const dispatch = useAppDispatch();

  const login = useCallback(
    async (data: LoginData) => {
      return await dispatch(loginSession(data)).unwrap();
    },
    [dispatch],
  );

  return { login };
};

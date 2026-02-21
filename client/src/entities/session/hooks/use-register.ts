'use client';

import { useAppDispatch } from '@/src/shared/store/redux-store';
import { useCallback } from 'react';
import { registerSession, type RegisterData } from '../model';

export const useRegister = () => {
  const dispatch = useAppDispatch();

  const register = useCallback(
    async (data: RegisterData) => {
      return await dispatch(registerSession(data)).unwrap();
    },
    [dispatch],
  );

  return { register };
};

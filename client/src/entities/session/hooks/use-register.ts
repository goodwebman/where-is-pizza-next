'use client';

import { useAppDispatch } from '@/src/shared/store/redux-store';
import { useCallback } from 'react';
import { registerSession, type RegisterData } from '../model';

export const useRegister = () => {
  const dispatch = useAppDispatch();

  const register = useCallback(
    async (data: RegisterData) => {
      const result = await dispatch(registerSession(data));
      return result;
    },
    [dispatch],
  );

  return { register };
};

'use client';

import { useAppDispatch } from '@/src/shared/store/redux-store';
import { logoutSession } from '../model';
import { useCallback } from 'react';

export const useLogout = () => {
  const dispatch = useAppDispatch();

  const logout = useCallback(async () => {
    const result = await dispatch(logoutSession());
    return result;
  }, [dispatch]);

  return { logout };
};
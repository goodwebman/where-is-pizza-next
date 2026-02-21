'use client';

import { useAppDispatch } from '@/src/shared/store/redux-store';
import { logoutSession } from '../model';
import { useCallback } from 'react';

export const useLogout = () => {
  const dispatch = useAppDispatch();

  const logout = useCallback(async () => {
    return await dispatch(logoutSession()).unwrap();
  
  }, [dispatch]);

  return { logout };
};
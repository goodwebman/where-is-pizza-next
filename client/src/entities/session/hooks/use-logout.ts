'use client';

import { QUERY_KEYS } from '@/src/shared/api';
import { useAppDispatch } from '@/src/shared/store/redux-store';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { logoutSession } from '@/src/entities/session/model/thunks'

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    await dispatch(logoutSession()).unwrap();

    queryClient.setQueryData([QUERY_KEYS.ME], null);
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.ME] });
  }, [dispatch, queryClient]);

  return { logout };
};

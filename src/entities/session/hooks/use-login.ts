'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/src/shared/api';
import type { LoginInput } from '@/src/shared/contracts';
import { sessionApi } from '../api/session.api';

export const useLogin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: LoginInput) => sessionApi.login(data),
    onSuccess: user => {
      queryClient.setQueryData([QUERY_KEYS.SESSION], user);
      // Server-side, logging in merged the guest cart into the account and
      // claimed past guest orders — both caches are stale as of this response.
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
    },
  });

  return { login: mutation.mutateAsync, loading: mutation.isPending };
};

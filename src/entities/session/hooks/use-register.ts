'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/src/shared/api';
import type { RegisterInput } from '@/src/shared/contracts';
import { sessionApi } from '../api/session.api';

export const useRegister = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: RegisterInput) => sessionApi.register(data),
    onSuccess: user => {
      queryClient.setQueryData([QUERY_KEYS.SESSION], user);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
    },
  });

  return { register: mutation.mutateAsync, loading: mutation.isPending };
};

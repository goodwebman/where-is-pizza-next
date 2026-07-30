'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/src/shared/api';
import { sessionApi } from '../api/session.api';

export const useLogout = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => sessionApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData([QUERY_KEYS.SESSION], null);
      // Drop everything scoped to the account, so the next person using this
      // browser cannot glimpse the previous user's data.
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.ME] });
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.ORDER] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
  });

  return { logout: mutation.mutateAsync, loading: mutation.isPending };
};

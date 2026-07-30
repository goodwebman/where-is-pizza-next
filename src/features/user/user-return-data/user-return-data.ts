'use client';

import { useQuery } from '@tanstack/react-query';

import { useIsAuthorized } from '@/src/entities/session';
import { User } from '@/src/entities/user';
import { userApi } from '@/src/entities/user/api/user.api';
import { QUERY_KEYS } from '@/src/shared/api';

/**
 * The full profile (phone, birth date), distinct from the identity returned by
 * the session query — hence a separate cache key.
 */
export const useUserReturnData = () => {
  const isAuth = useIsAuthorized();

  return useQuery<User | null>({
    queryKey: [QUERY_KEYS.ME],
    queryFn: userApi.getUser,
    enabled: isAuth,
    staleTime: 1000 * 60 * 5,
  });
};

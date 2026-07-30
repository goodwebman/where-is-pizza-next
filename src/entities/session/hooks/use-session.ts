'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/src/shared/api';
import type { SessionUser } from '@/src/shared/contracts';
import { sessionApi } from '../api/session.api';
import { hasAuthMarker } from '../lib/auth-marker';

/**
 * The client's single source of truth for the current user.
 *
 * Replaces the Redux `session` slice: the access token used to live in memory,
 * which meant a full page load always started logged-out and had to recover via
 * an effect. Now the cookies are sent automatically and this query just reads
 * who they belong to.
 */
export const useSession = () =>
  useQuery<SessionUser | null>({
    queryKey: [QUERY_KEYS.SESSION],
    queryFn: () => sessionApi.getSession(),
    // Skip the request entirely for visitors who have never logged in.
    enabled: hasAuthMarker(),
    staleTime: 1000 * 60 * 5,
    // A 401 means "not logged in", not "try again".
    retry: false,
  });

export const useIsAuthorized = (): boolean => {
  const { data } = useSession();
  return Boolean(data);
};

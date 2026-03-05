import { selectIsAuthorized } from '@/src/entities/session';
import { User } from '@/src/entities/user';
import { userApi } from '@/src/entities/user/api/user.api';
import { QUERY_KEYS } from '@/src/shared/api';
import { useAppSelector } from '@/src/shared/store/redux-store';
import { useQuery } from '@tanstack/react-query';

export const useUserReturnData = () => {
  const isAuth = useAppSelector(selectIsAuthorized);

  return useQuery<User | null>({
    queryKey: [QUERY_KEYS.ME],
    queryFn: userApi.getUser,
    enabled: isAuth,
    staleTime: 1000 * 60 * 5,
  });
};

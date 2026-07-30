'use client';

import { selectIsAuthorized } from '@/src/entities/session';
import { ROUTES } from '@/src/shared/config';
import { useAppSelector } from '@/src/shared/store/redux-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const auth = useAppSelector(selectIsAuthorized);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.replace(ROUTES.HOME);
    }
  }, [auth]);

  return <>{children}</>;
}

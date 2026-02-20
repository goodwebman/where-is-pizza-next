'use client';

import { useLogout } from '@/src/entities/session';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export const useOptionsSelect = () => {
  const router = useRouter();
  const { logout } = useLogout();
  const options = useMemo(
    () => [
      { value: 'bonuses', children: 'Бонусы', href: '/profile/bonuses' },
      { value: 'orders', children: 'История заказов', href: '/profile/orders' },
      { value: 'settings', children: 'Настройки', href: '/profile/settings' },
      { value: 'logout', children: 'Выйти из аккаунта' },
    ],
    [],
  );

  const handleSelect = useCallback(
    async (value: string, href?: string) => {
      if (value === 'logout') {
        logout();
      }

      if (href) {
        router.push(href);
      }
    },
    [router],
  );

  return { options, handleSelect };
};

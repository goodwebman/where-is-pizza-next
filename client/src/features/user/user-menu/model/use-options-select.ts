'use client';

import { useLogout } from '@/src/entities/session';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

export const useOptionsSelect = () => {
  const router = useRouter();
  const { logout } = useLogout();
  const options = useMemo(
    () => [
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
        toast.success('Вы успешно вышли из аккаунта!', {
          position: 'top-center',
        });
      }

      if (href) {
        router.push(href);
      }
    },
    [router],
  );

  return { options, handleSelect };
};

'use client';

import { useCallback, useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onStoreChange);
      return () => mediaQuery.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    typeof window === 'undefined' ? emptySubscribe : subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
};

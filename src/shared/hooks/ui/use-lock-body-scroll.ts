'use client'
import { useEffect } from 'react';

/**
 * Хук блокировки прокрутки страницы
 * @param isLocked - true = блокируем, false = разблокируем
 */
export const useLockBodyScroll = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
};

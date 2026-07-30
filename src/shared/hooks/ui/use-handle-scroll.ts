'use client'
import { useCallback } from 'react';

type UseHandleScrollParams = {
  scrollRef?: React.RefObject<HTMLElement>;
  scrollToId?: string;
  offset?: number;
  onClick?: () => void;
};

export function useHandleScroll({
  scrollRef,
  scrollToId,
  offset = 0,
  onClick,
}: UseHandleScrollParams) {
  return useCallback(() => {
    let targetEl: HTMLElement | null = null;

    if (scrollRef?.current) {
      targetEl = scrollRef.current;
    } else if (scrollToId) {
      targetEl = document.getElementById(scrollToId);
    }

    if (!targetEl) {
      onClick?.();
      return;
    }

    const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: 'smooth',
    });

    onClick?.();
  }, [scrollRef, scrollToId, offset, onClick]);
}

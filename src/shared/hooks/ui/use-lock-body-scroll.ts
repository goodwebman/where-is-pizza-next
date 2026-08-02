'use client';
import { useEffect } from 'react';

/**
 * The lock is refcounted at module level, not per-hook-instance. Two components
 * can hold it at once - a modal opened from the mobile menu, or a component that
 * locks itself while also rendering <Modal>, which locks too. With a per-instance
 * "remember the previous value" approach the second locker snapshots `hidden`
 * (already set by the first) and restores it on unmount, killing page scroll for
 * good. Only the first acquire snapshots, only the last release restores.
 */
let lockCount = 0;
let restoreBodyStyle: (() => void) | null = null;

const acquireLock = () => {
  lockCount += 1;
  if (lockCount > 1) return;

  const { overflow, paddingRight } = document.body.style;
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  document.body.style.overflow = 'hidden';

  // Compensating for the scrollbar that just disappeared keeps the layout from
  // jumping sideways the moment the modal opens.
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  restoreBodyStyle = () => {
    document.body.style.overflow = overflow;
    document.body.style.paddingRight = paddingRight;
  };
};

const releaseLock = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  restoreBodyStyle?.();
  restoreBodyStyle = null;
};

export const useLockBodyScroll = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;

    acquireLock();

    return releaseLock;
  }, [locked]);
};

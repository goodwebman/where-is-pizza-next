'use client'
import { RefObject, useEffect } from 'react';

/**
 * Custom hook to detect clicks outside of a specified element.
 *
 * @param ref The ref object for the element to detect clicks outside of.
 * @param handler The callback function to be executed when a click outside is detected.
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};


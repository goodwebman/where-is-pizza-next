/* eslint-disable no-console */

export const isBrowser = () => typeof window !== 'undefined';

export const localStorageService = {
  get<T>(key: string): T | null {
    if (!isBrowser()) return null;

    try {
      const value = window.localStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn(`[LocalStorage] get error for key "${key}"`, error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser()) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[LocalStorage] set error for key "${key}"`, error);
    }
  },

  remove(key: string): void {
    if (!isBrowser()) return;

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[LocalStorage] remove error for key "${key}"`, error);
    }
  },
};

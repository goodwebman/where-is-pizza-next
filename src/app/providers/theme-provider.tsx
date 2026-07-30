'use client';

import { StorageKey } from '@/src/shared/config/storages/storage-keys';
import { localStorageService } from '@/src/shared/lib/storage';
import { darkTheme, lightTheme } from '@/src/shared/theme';
import { ThemeContext } from '@/src/shared/theme/context/theme-context';
import { ThemeNameEnum, ThemeType } from '@/src/shared/theme/types';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

const getInitialTheme = (): ThemeNameEnum => {
  const savedTheme = localStorageService.get<ThemeNameEnum>(StorageKey.THEME);

  if (savedTheme === ThemeNameEnum.DARK || savedTheme === ThemeNameEnum.LIGHT) {
    return savedTheme;
  }

  if (typeof window !== 'undefined') {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    return prefersDark ? ThemeNameEnum.DARK : ThemeNameEnum.LIGHT;
  }

  return ThemeNameEnum.LIGHT;
};

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentTheme, setCurrentTheme] =
    useState<ThemeNameEnum>(getInitialTheme);

  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
    localStorageService.set(StorageKey.THEME, currentTheme);
  }, [currentTheme]);

  const selectedTheme: ThemeType = useMemo(
    () => (currentTheme === ThemeNameEnum.DARK ? darkTheme : lightTheme),
    [currentTheme],
  );

  const toggleTheme = useCallback(() => {
    setCurrentTheme(prev =>
      prev === ThemeNameEnum.LIGHT ? ThemeNameEnum.DARK : ThemeNameEnum.LIGHT,
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      theme: selectedTheme,
      selectTheme: setCurrentTheme,
      toggleTheme,
      currentTheme,
    }),
    [selectedTheme, toggleTheme, currentTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

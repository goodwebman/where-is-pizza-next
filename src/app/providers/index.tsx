'use client';

import { ReactNode } from 'react';

import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

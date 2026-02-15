import { LocationProvider } from '@/src/entities/location/model/location-context';
import { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LocationProvider>{children}</LocationProvider>
    </ThemeProvider>
  );
}

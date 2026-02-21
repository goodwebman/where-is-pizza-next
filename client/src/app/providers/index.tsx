import { LocationProvider } from '@/src/entities/location/model/location-context';
import { ReactNode } from 'react';
import { ReduxProvider } from './redux-provider';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/src/shared/ui/toaster/toaster'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <Toaster />
        <LocationProvider>{children}</LocationProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

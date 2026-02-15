import { LocationProvider } from '@/src/entities/location/model/location-context';
import { ReactNode } from 'react';
import { ReduxProvider } from './redux-provider';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <LocationProvider>{children}</LocationProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}

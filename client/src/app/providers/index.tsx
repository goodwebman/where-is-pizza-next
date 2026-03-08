import { LocationProvider } from '@/src/entities/location/model/location-context';
import { Toaster } from '@/src/shared/ui/toaster/toaster';
import { ReactNode } from 'react';

import { ReactQueryProvider } from './query-client-provider';
import { ReduxProvider } from './redux-provider';
import { ThemeProvider } from './theme-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <ThemeProvider>
          <Toaster />
          <LocationProvider>
           {children}
          </LocationProvider>
        </ThemeProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
}

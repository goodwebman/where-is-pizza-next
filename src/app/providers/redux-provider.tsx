'use client';

import type { FC, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from '@/src/shared/store/redux-store';

/**
 * Redux now carries UI state only (filters, drawers, modals).
 *
 * The SessionInitializer that used to live here — dispatching a refresh on
 * mount to rebuild an in-memory access token — is gone: the session travels in
 * httpOnly cookies and is read by the `useSession` query on demand.
 */
export const ReduxProvider: FC<PropsWithChildren> = ({ children }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  </Provider>
);

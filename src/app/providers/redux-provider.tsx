'use client'
import { refreshSession } from '@/src/entities/session/model/thunks'
import { persistor, store, useAppDispatch } from '@/src/shared/store/redux-store';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

/**
 * On mount, silently try to refresh the session.
 * If a valid httpOnly refresh cookie exists, the access token
 * is restored in Redux memory (not localStorage).
 */
const SessionInitializer: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(refreshSession());
  }, [dispatch]);

  return <>{children}</>;
};

export const ReduxProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionInitializer>
          {children}
        </SessionInitializer>
      </PersistGate>
    </Provider>
  );
};

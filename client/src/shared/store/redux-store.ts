import { cartDrawerSlice } from '@/src/entities/cart/model/slice';
import { filtersSlice } from '@/src/entities/filters/model/slice';
import sessionReducer from '@/src/entities/session/model/slice'
import {
  combineReducers,
  configureStore,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  useStore,
  type TypedUseSelectorHook,
} from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  session: sessionReducer,
  filters: filtersSlice.reducer,
  cartDrawer: cartDrawerSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['session', 'filters'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<R = void> = ThunkAction<
  R,
  RootState,
  unknown,
  UnknownAction
>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppStore = () => useStore<typeof store>();

export const persistor = persistStore(store);

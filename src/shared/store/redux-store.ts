import { cartDrawerSlice } from '@/src/entities/cart/model/slice';
import { filtersSlice } from '@/src/entities/filters/model/slice';
import sessionReducer from '@/src/entities/session/model/slice'
import { productCardModalSlice } from '@/src/features/product'
import { registerStore } from '@/src/shared/lib/helpers/redux/store-registry'
import {
  combineReducers,
  configureStore,
  type Reducer,
  type ThunkAction,
  type UnknownAction,
} from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  useStore,
  type TypedUseSelectorHook,
} from 'react-redux';
import type { FiltersState } from '@/src/entities/filters/model/slice'
import { createTransform,
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
  productCardModal: productCardModalSlice.reducer
});

/**
 * Persist only selectedFilters from the filters slice.
 * Ephemeral UI state (openDrawerCategory) should not survive a refresh.
 */
type FiltersPersisted = Omit<FiltersState, 'openDrawerCategory'>

const filtersTransform = createTransform<FiltersState, FiltersPersisted>(
  // inbound: runtime → storage — strip ephemeral UI state
  (state) => {
    const { openDrawerCategory, ...rest } = state
    return rest
  },
  // outbound: storage → runtime — restore defaults
  (raw) => ({
    ...raw,
    openDrawerCategory: null,
  }),
  { whitelist: ['filters'] },
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['filters' as const],
  transforms: [filtersTransform],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer as Reducer<ReturnType<typeof rootReducer>, UnknownAction>,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

registerStore(store)

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

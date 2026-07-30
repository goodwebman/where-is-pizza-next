import { RootState } from '@/src/shared/store/redux-store';

export const selectOpenDrawerCart = (state: RootState) =>
  state.cartDrawer.isOpen;

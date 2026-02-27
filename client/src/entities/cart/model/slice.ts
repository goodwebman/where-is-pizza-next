import { createSlice } from '@reduxjs/toolkit';

type CartDrawerState = {
  isOpen: boolean;
};

const initialState: CartDrawerState = { isOpen: false };

export const cartDrawerSlice = createSlice({
  name: 'cartDrawer',
  initialState,
  reducers: {
    openCartDrawer: state => {
      state.isOpen = true;
    },
    closeCartDrawer: state => {
      state.isOpen = false;
    },
    toggleCartDrawer: state => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openCartDrawer, closeCartDrawer, toggleCartDrawer } =
  cartDrawerSlice.actions;
export default cartDrawerSlice.reducer;

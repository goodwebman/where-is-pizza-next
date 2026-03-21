import { ProductDetails } from '@/src/entities/product/model/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductCardModalState {
  isOpen: boolean;
  product: ProductDetails | null;
}

const initialState: ProductCardModalState = {
  isOpen: false,
  product: null,
};

export const productCardModalSlice = createSlice({
  name: 'productCardModal',
  initialState,
  reducers: {
    openProductCardModal: (
      state,
      action: PayloadAction<ProductDetails | null>,
    ) => {
      state.isOpen = true;
      state.product = action.payload;
    },

    closeProductCardModal: state => {
      state.isOpen = false;
      state.product = null;
    },
  },
});

export const { openProductCardModal, closeProductCardModal } =
  productCardModalSlice.actions;

export default productCardModalSlice.reducer;



import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductDetails } from '@/src/entities/product/model/types';

export type SelectedOptions = Record<
  string,     // optionId
  string[]    // valueIds
>;

export type ProductConfiguratorState = {
  isOpen: boolean;
  product: ProductDetails | null;
  selected: SelectedOptions;
};

const initialState: ProductConfiguratorState = {
  isOpen: false,
  product: null,
  selected: {},
};

export const productConfiguratorSlice = createSlice({
  name: 'productConfigurator',
  initialState,
  reducers: {
    openProduct: (state, action: PayloadAction<ProductDetails>) => {
      state.product = action.payload;
      state.isOpen = true;
      state.selected = {};
    },

    closeProduct: state => {
      state.isOpen = false;
      state.product = null;
      state.selected = {};
    },

    selectOptionValue: (
      state,
      action: PayloadAction<{
        optionId: string;
        valueId: string;
        multiple?: boolean;
      }>
    ) => {
      const { optionId, valueId, multiple } = action.payload;
      const current = state.selected[optionId] ?? [];

      if (multiple) {
        const exists = current.includes(valueId);

        state.selected[optionId] = exists
          ? current.filter(v => v !== valueId)
          : [...current, valueId];
      } else {
        state.selected[optionId] = [valueId];
      }
    },

    resetSelectedOptions: state => {
      state.selected = {};
    },
  },
});

export const {
  openProduct,
  closeProduct,
  selectOptionValue,
  resetSelectedOptions,
} = productConfiguratorSlice.actions;

export default productConfiguratorSlice.reducer;
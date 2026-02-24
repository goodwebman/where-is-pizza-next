import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/src/shared/store/redux-store';

export const selectConfiguratorState = (state: RootState) =>
  state.productConfigurator;

export const selectConfiguratorOpen = (state: RootState) =>
  state.productConfigurator.isOpen;

export const selectConfiguratorProduct = (state: RootState) =>
  state.productConfigurator.product;

export const selectSelectedOptions = (state: RootState) =>
  state.productConfigurator.selected;


export const selectConfiguredPrice = createSelector(
  [
    (state: RootState) => state.productConfigurator.product,
    (state: RootState) => state.productConfigurator.selected,
  ],
  (product, selected) => {
    if (!product) return 0;

    let total = product.price;

    product.options?.forEach(option => {
      const selectedValues = selected[option.id] ?? [];

      option.values.forEach(v => {
        if (selectedValues.includes(v.id)) {
          total += v.price ?? 0;
        }
      });
    });

    return total;
  },
);

export const selectConfiguratorValid = createSelector(
  [
    (state: RootState) => state.productConfigurator.product,
    (state: RootState) => state.productConfigurator.selected,
  ],
  (product, selected) => {
    if (!product?.options) return true;

    return product.options.every(option => {
      if (!option.required) return true;
      return (selected[option.id] ?? []).length > 0;
    });
  },
);
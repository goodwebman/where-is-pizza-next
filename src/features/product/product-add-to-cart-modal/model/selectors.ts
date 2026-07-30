import { ProductDetails } from '@/src/entities/product/model/types'
import { RootState } from '@/src/shared/store/redux-store'


export const selectProductModalIsOpen = (state: RootState): boolean =>
  state.productCardModal.isOpen;

export const selectProductModalProduct = (state: RootState): ProductDetails | null =>
  state.productCardModal.product;


export const selectProductModalState = (state: RootState) => ({
  isOpen: state.productCardModal.isOpen,
  product: state.productCardModal.product,
});
'use client';

import { SelectedOptions } from '@/src/entities/cart';
import { ProductDetails } from '@/src/entities/product/model/types';
import { useAddProductToCart } from '@/src/features/cart';

export const useAddProductToCartHandler = (onClose: () => void) => {
  const { addToCart, loading } = useAddProductToCart();

  const handleAddToCart = async (
    product: ProductDetails,
    selected: SelectedOptions,
  ) => {
    if (!product) return;

    // The price used to be computed here and sent along; the server now derives
    // it from the catalogue and ignores anything the client believes it costs.
    // Display-side pricing still lives in the modal, where it belongs.
    await addToCart({
      productId: product.id,
      selectedOptions: selected,
      quantity: 1,
    });

    onClose();
  };

  return { handleAddToCart, loading };
};

'use client';

import { SelectedOptions } from '@/src/entities/cart';
import { useAddProductToCart } from '@/src/entities/cart/hooks/use-add-product-to-cart';
import { ProductDetails, ProductOption } from '@/src/entities/product/model/types';

export const useAddProductToCartHandler = (onClose: () => void) => {
  const { addToCart, loading } = useAddProductToCart();

  const handleAddToCart = async (
    product: ProductDetails,
    selected: SelectedOptions
  ) => {
    if (!product) return;


    let finalPrice = product.price;

    product.options?.forEach((option: ProductOption) => {
      const selectedIds = selected[option.id];
      if (!selectedIds || !selectedIds.length) return;

      option.values.forEach(value => {
        if (selectedIds.includes(value.id) && value.price) {
          finalPrice += value.price;
        }
      });
    });

    await addToCart({
      productId: product.id,
      selectedOptions: selected,
      quantity: 1,
      price: finalPrice,
    });

    onClose();
  };

  return { handleAddToCart, loading };
};
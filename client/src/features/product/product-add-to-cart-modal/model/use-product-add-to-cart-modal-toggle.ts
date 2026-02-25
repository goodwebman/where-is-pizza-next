'use client';

import { ProductDetails } from '@/src/entities/product/model/types';
import { useCallback, useState } from 'react';

export const useProductAddToCartModalToggle = () => {
  const [product, setProduct] = useState<ProductDetails | null>(null);

  const open = useCallback((p: ProductDetails) => {
    setProduct(p);
  }, []);

  const close = useCallback(() => {
    setProduct(null);
  }, []);

  return {
    product,
    open,
    close,
    isOpen: !!product,
  };
};

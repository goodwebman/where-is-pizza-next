'use client';
import { ProductDetails } from '@/src/entities/product/model/types';
import { createContext, ReactNode, useState } from 'react';

type ProductModalContextType = {
  product: ProductDetails | null;
  isOpen: boolean;
  open: (product: ProductDetails) => void;
  close: () => void;
};

export const ProductModalContext = createContext<
  ProductModalContextType | undefined
>(undefined);

export const ProductModalProvider = ({ children }: { children: ReactNode }) => {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = (p: ProductDetails) => {
    setProduct(p);
    setIsOpen(true);
  };

  const close = () => {
    setProduct(null);
    setIsOpen(false);
  };

  return (
    <ProductModalContext.Provider value={{ product, isOpen, open, close }}>
      {children}
    </ProductModalContext.Provider>
  );
};

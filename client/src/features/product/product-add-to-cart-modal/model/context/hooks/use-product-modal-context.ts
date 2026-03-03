import { useContext } from 'react';
import { ProductModalContext } from '../product-modal-context';

export const useProductModalContext = () => {
  const ctx = useContext(ProductModalContext);
  if (!ctx)
    throw new Error(
      'useProductModalContext must be used inside ProductModalProvider',
    );
  return ctx;
};

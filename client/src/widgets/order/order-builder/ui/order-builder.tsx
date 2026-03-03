'use client';

import { useGetCartInfo } from '@/src/features/cart';
import { OrderForm } from '@/src/features/order/order-form/ui';
import { ProductAddToCartModal } from '@/src/features/product';
import { ProductModalProvider } from '@/src/features/product/product-add-to-cart-modal/model/context/product-modal-context';
import { WithClassNames } from '@/src/shared/types';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';
import { OrderPreview } from '@/src/features/order/order-preview/ui/order-preview'
import { AddToOrderSlider } from '@/src/features/order/add-to-order-slider'

export const OrderBuilder: FC<WithClassNames> = ({ className }) => {
  const { data: cart, isLoading, totalPrice, totalItems } = useGetCartInfo();
  const { cnContainer, cnLabelExtra } = getClasses({ className });

  return (
    <ProductModalProvider>
      <section className={cnContainer}>
        <OrderPreview
          cart={cart}
          isLoading={isLoading}
          totalItems={totalItems}
          totalPrice={totalPrice}
        />

        <h2 className={cnLabelExtra}>Добавить к заказу?</h2>

        <AddToOrderSlider categoryId="snacks" />
        <AddToOrderSlider categoryId="sauce" />

        <OrderForm fullPrice={totalPrice} />

        <ProductAddToCartModal />
      </section>
    </ProductModalProvider>
  );
};

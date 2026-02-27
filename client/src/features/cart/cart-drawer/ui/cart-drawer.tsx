'use client';

import { selectOpenDrawerCart } from '@/src/entities/cart/model/selectors';
import { closeCartDrawer } from '@/src/entities/cart/model/slice';

import { CartLayout } from '@/src/entities/cart/ui/layout';
import { useAppDispatch, useAppSelector } from '@/src/shared/store/redux-store';
import { Buttons, Drawer } from '@/src/shared/ui';
import Image from 'next/image';
import { getClasses } from './styles/get-classes';
import { useGetCartInfo } from '../../get-cart-info'

export const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectOpenDrawerCart);
  const { cart, totalPrice, totalItems, isLoading } = useGetCartInfo();

  const {
    cnFooter,
    cnRow,
    cnTotalLabel,
    cnTotalPrice,
    cnButton,
    cnRoot,
    cnEmptyCart,
  } = getClasses({});

  if (!isOpen) return null;

  const isCartEmpty = !cart || !cart.items || cart.items.length === 0;
  return (
    <Drawer
      label="Ваш заказ"
      isOpen={isOpen}
      onClose={() => dispatch(closeCartDrawer())}
      className={cnRoot}
    >
      <CartLayout.CartContainer>
        {isLoading ? (
          <>
            <CartLayout.CartItemSkeleton />
            <CartLayout.CartItemSkeleton />
            <CartLayout.CartItemSkeleton />
            <CartLayout.CartItemSkeleton />
            <CartLayout.CartItemSkeleton />
            <CartLayout.CartItemSkeleton />
          </>
        ) : !isCartEmpty ? (
          cart?.items.map(item => (
            <CartLayout.CartItem
              key={item.id}
              mode="default"
              product={item.product}
              selectedOptions={item.selectedOptions}
              quantity={item.quantity}
              cartItemId={item.id}
              price={item.price}
            />
          ))
        ) : (
          <section className={cnEmptyCart}>
            <Image
              src={'/images/cart-empty.png'}
              width={180}
              height={180}
              alt="Корзина пуста"
            />
            <p>Корзина пуста</p>
          </section>
        )}
      </CartLayout.CartContainer>

      {!isCartEmpty && (
        <div className={cnFooter}>
          <div className={cnRow}>
            <span className={cnTotalLabel}>Товаров: {totalItems}</span>
            <span className={cnTotalPrice}>{totalPrice}₽</span>
          </div>

          <Buttons.DefaultButton className={cnButton}>
            Заказать
          </Buttons.DefaultButton>
        </div>
      )}
    </Drawer>
  );
};

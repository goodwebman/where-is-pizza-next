import { Cart, CartLayout } from '@/src/entities/cart';
import {
  useDeleteProductFromCart,
  useUpdateCartItem,
} from '@/src/features/cart';
import { WithClassNames } from '@/src/shared/types';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type OrderPreviewProps = {
  cart: Cart | null | undefined;
  isLoading: boolean;
  totalPrice: number;
  totalItems: number;
};

export const OrderPreview: FC<WithClassNames<OrderPreviewProps>> = ({
  className,
  cart,
  isLoading,
  totalItems,
  totalPrice,
}) => {
  const { removeFromCart } = useDeleteProductFromCart();
  const { updateQuantity } = useUpdateCartItem();

  const { cnRoot, cnLabel, cnTotal, cnTotalWrapper } = getClasses({
    className,
  });
  return (
    <section className={cnRoot}>
      <h1 className={cnLabel}>Ваш заказ</h1>
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
        ) : (
          cart?.items.map(item => (
            <CartLayout.CartItem
              key={item.id}
              orderView
              product={item.product}
              selectedOptions={item.selectedOptions}
              quantity={item.quantity}
              cartItemId={item.id}
              price={item.price}
              onRemove={removeFromCart}
              onChangeQuantity={(id, qty) =>
                updateQuantity({ cartItemId: id, quantity: qty })
              }
            />
          ))
        )}
      </CartLayout.CartContainer>
      <div className={cnTotalWrapper}>
        <p className={cnTotal}>Продуктов: {totalItems}</p>
        <p className={cnTotal}>Итого: {totalPrice} ₽</p>
      </div>
    </section>
  );
};

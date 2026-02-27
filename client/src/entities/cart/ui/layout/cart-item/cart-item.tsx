import { ProductDetails } from '@/src/entities/product/model/types';
import { useDebounceCallback } from '@/src/shared/hooks/perfomance';
import { getOptionsText } from '@/src/shared/lib/helpers/formaters';
import { WithClassNames } from '@/src/shared/types';
import { Counter } from '@/src/shared/ui';
import { FC } from 'react';

import { SelectedOptions } from '../../../model';
import { getCartItemClasses } from './styles/get-classes';
import { useDeleteProductFromCart, useUpdateCartItem } from '@/src/features/cart'

type CartItemProps = {
  product: ProductDetails;
  quantity: number;
  cartItemId: string;
  selectedOptions: SelectedOptions;
  mode: 'drawer' | 'default';
  price: number;
};

export const CartItem: FC<WithClassNames<CartItemProps>> = ({
  className,
  product,
  cartItemId,
  quantity,
  mode,
  selectedOptions,
  price,
}) => {
  const { cnContainer, cnLeftBlock, cnRightBlock, cnImage, cnLabel, cnPrice, cnOptions, cnQuantityWithPrice } =
    getCartItemClasses({ className, mode });
  const { removeFromCart } = useDeleteProductFromCart();

  const { updateQuantity } = useUpdateCartItem();

  const debouncedUpdate = useDebounceCallback((value: number) => {
    updateQuantity({
      cartItemId,
      quantity: value,
    });
  }, 200);

  const handleChange = (value: number) => {
    if (value <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    debouncedUpdate(value);
  };

  const totalItemPrice = price * quantity;

  return (
    <div className={cnContainer}>
      <div className={cnLeftBlock}>
        <img src={product.imageSrc} alt={product.title} className={cnImage} />
      </div>
      <div className={cnRightBlock}>
        <div className={cnLabel}>{product.title}</div>

        <div className={cnOptions}>{getOptionsText(selectedOptions)}</div>

        <div className={cnQuantityWithPrice}>
          <Counter max={20} value={quantity} onChange={handleChange} min={0} />
          <div className={cnPrice}>{totalItemPrice}₽</div>
        </div>
      </div>
    </div>
  );
};

CartItem.displayName = 'CartItem';

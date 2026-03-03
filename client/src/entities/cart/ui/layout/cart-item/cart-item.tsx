import { ProductDetails } from '@/src/entities/product/model/types';
import { useDebounceCallback } from '@/src/shared/hooks/perfomance';
import { getOptionsText } from '@/src/shared/lib/helpers/formaters';
import { WithClassNames } from '@/src/shared/types';
import { Counter } from '@/src/shared/ui';
import { FC } from 'react';

import { SelectedOptions } from '../../../model';
import { getCartItemClasses } from './styles/get-classes';

type CartItemProps = {
  product: ProductDetails;
  quantity: number;
  cartItemId: string;
  selectedOptions: SelectedOptions;
  price: number;
  orderView?: boolean;
  onRemove: (cartItemId: string) => void;
  onChangeQuantity: (cartItemId: string, quantity: number) => void;
};

export const CartItem: FC<WithClassNames<CartItemProps>> = ({
  className,
  product,
  cartItemId,
  quantity,
  orderView = false,
  selectedOptions,
  price,
  onChangeQuantity,
  onRemove,
}) => {
  const {
    cnContainer,
    cnLeftBlock,
    cnRightBlock,
    cnImage,
    cnLabel,
    cnPrice,
    cnOptions,
    cnQuantityWithPrice,
    cnRightBlockWrapper,
    cnCounter,
  } = getCartItemClasses({ className, orderView });
  const debouncedUpdate = useDebounceCallback((value: number) => {
    onChangeQuantity(cartItemId, value);
  }, 200);

  const handleChange = (value: number) => {
    if (value <= 0) {
      onRemove(cartItemId);
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
        <div className={cnRightBlockWrapper}>
          <div className={cnLabel}>{product.title}</div>
          <div className={cnOptions}>{getOptionsText(selectedOptions)}</div>
        </div>

        <div className={cnQuantityWithPrice}>
          <Counter
            max={20}
            value={quantity}
            onChange={handleChange}
            min={0}
            className={cnCounter}
          />
          <div className={cnPrice}>{totalItemPrice}₽</div>
        </div>
      </div>
    </div>
  );
};

CartItem.displayName = 'CartItem';

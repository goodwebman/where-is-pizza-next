import { Icons } from '@/src/shared/assets/svg/components';
import { WithClassNames } from '@/src/shared/types';
import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { useGetCartInfo } from '../../../hooks';
import { toggleCartDrawer } from '../../../model/slice';
import { getClasses } from './styles/get-classes';


export const CartBadge: FC<WithClassNames> = ({
  className,
  
}) => {
  const dispatch = useDispatch();
  const { totalPrice } = useGetCartInfo();

  const { cnRoot, cnValue } = getClasses({ className });

  const handleClick = () => {
    dispatch(toggleCartDrawer());
  };

  return (
    <button className={cnRoot} onClick={handleClick}>
      <Icons.CartBag color="var(--icon-primary)" width={24} height={24} />
      <span className={cnValue}>{totalPrice.toFixed(0)} ₽</span>
    </button>
  );
};

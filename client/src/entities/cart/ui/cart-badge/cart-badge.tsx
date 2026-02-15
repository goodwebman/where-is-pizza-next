import { Icons } from '@/src/shared/assets/svg/components';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type CartBadgeProps = {
  className?: string;
};

export const CartBadge: FC<CartBadgeProps> = ({ className }) => {
  const { cnRoot, cnValue } = getClasses({ className });
  return (
    <button className={cnRoot}>
      <Icons.CartBag width={24} height={24} />
      <span className={cnValue}>0 ₽</span>
    </button>
  );
};

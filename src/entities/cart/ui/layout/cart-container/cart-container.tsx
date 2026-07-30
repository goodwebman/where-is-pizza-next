import { WithChildren, WithClassNames } from '@/src/shared/types';
import { FC } from 'react';
import { getCartContainerClasses } from './styles/get-classes';

export const CartContainer: FC<WithChildren<WithClassNames>> = ({
  children,
  className,
}) => {
  const { cnContainer } = getCartContainerClasses({ className });
  return <div className={cnContainer}>{children}</div>;
};

CartContainer.displayName = 'CartContainer';

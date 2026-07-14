'use client';

import { WithClassNames } from '@/src/shared/types';
import { Buttons } from '@/src/shared/ui';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type OrderSubmitSectionProps = {
  fullPrice: number;
  totalItems: number;
  isPending?: boolean;
};

export const OrderSubmitSection: FC<
  WithClassNames<OrderSubmitSectionProps>
> = ({ className, fullPrice, totalItems, isPending }) => {
  const { cnSubmit, cnSubmitPrice } = getClasses({ className });
  const isDisabled = totalItems < 1 || isPending
  return (
    <div className={cnSubmit}>
      <p className={cnSubmitPrice}>Итого: {fullPrice ?? 0}₽</p>
      <Buttons.DefaultButton type="submit" disabled={isDisabled}>
        {isPending ? 'Оформляем...' : 'Оформить заказ'}
      </Buttons.DefaultButton>
    </div>
  );
};

'use client';

import { WithClassNames } from '@/src/shared/types';
import { Buttons } from '@/src/shared/ui';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type OrderSubmitSectionProps = {
  fullPrice: number;
  totalItems: number;
};

export const OrderSubmitSection: FC<
  WithClassNames<OrderSubmitSectionProps>
> = ({ className, fullPrice, totalItems }) => {
  const { cnSubmit, cnSubmitPrice } = getClasses({ className });
  const isDisabled = totalItems < 1
  return (
    <div className={cnSubmit}>
      <p className={cnSubmitPrice}>Итого: {fullPrice ?? 0}₽</p>
      <Buttons.DefaultButton type="submit" disabled={isDisabled}>
        Оформить заказ
      </Buttons.DefaultButton>
    </div>
  );
};

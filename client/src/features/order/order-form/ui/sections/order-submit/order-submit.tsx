'use client';

import { WithClassNames } from '@/src/shared/types';
import { Buttons } from '@/src/shared/ui';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type OrderSubmitSectionProps = {
  fullPrice: number;
};

export const OrderSubmitSection: FC<
  WithClassNames<OrderSubmitSectionProps>
> = ({ className, fullPrice }) => {
  const { cnSubmit, cnSubmitPrice } = getClasses({ className });

  return (
    <div className={cnSubmit}>
      <p className={cnSubmitPrice}>Итого: {fullPrice ?? 0}₽</p>
      <Buttons.DefaultButton type="submit">
        Оформить заказ
      </Buttons.DefaultButton>
    </div>
  );
};

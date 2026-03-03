'use client';

import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Radio } from '@/src/shared/ui';
import { OrderSchemaValues, PaymentMethod } from '../../../model';
import { getClasses } from './styles/get-classes';
import { WithClassNames } from '@/src/shared/types';

export const OrderPaymentSection: FC<WithClassNames> = ({ className }) => {
  const { control } = useFormContext<OrderSchemaValues>();
  const { cnRadioWrapper, cnRadioLabel, cnRadioSection } = getClasses({ className });

  return (
    <div className={cnRadioWrapper}>
      <p className={cnRadioLabel}>Оплата</p>
      <Radio.RadioGroupField
        control={control}
        name="paymentMethod"
        options={[
          { value: PaymentMethod.Cash, label: 'Наличными' },
          { value: PaymentMethod.Card, label: 'Картой' },
          { value: PaymentMethod.ApplePay, label: 'Apple Pay' },
        ]}
        className={cnRadioSection}
      />
    </div>
  );
};
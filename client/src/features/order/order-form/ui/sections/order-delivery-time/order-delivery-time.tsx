'use client';

import { FC, memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { InputDefaultField, Radio } from '@/src/shared/ui';
import { DeliveryTime, OrderSchemaValues } from '../../../model';
import { getClasses } from './styles/get-classes';

export const OrderDeliveryTimeSection: FC = memo(() => {
  const { control } = useFormContext<OrderSchemaValues>();
  const deliveryTime = useWatch({ control, name: 'deliveryTime' });

  const { cnRadioWrapper, cnRadioRows, cnRadioSupLabel, cnRadioSection, cnRadioInput, cnRadioInputField } = getClasses({});

  return (
    <div className={cnRadioWrapper}>
      <p className={cnRadioSupLabel}>Когда выполнить заказ?</p>
      <div className={cnRadioRows}>
        <Radio.RadioGroupField
          control={control}
          name="deliveryTime"
          options={[
            { value: DeliveryTime.ASAP, label: 'Как можно скорее' },
            { value: DeliveryTime.Scheduled, label: 'По времени' },
          ]}
          className={cnRadioSection}
        />

        {deliveryTime === DeliveryTime.Scheduled && (
          <div className={cnRadioInput}>
            <InputDefaultField control={control} name="scheduledDate" type="date" className={cnRadioInputField} />
            <InputDefaultField control={control} name="scheduledTime" type="time" className={cnRadioInputField} />
          </div>
        )}
      </div>
    </div>
  );
});
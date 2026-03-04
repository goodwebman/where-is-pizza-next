'use client';

import { InputDefaultField, Radio } from '@/src/shared/ui';
import { FC, memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { OrderSchemaValues } from '../../../model';
import { getClasses } from './styles/get-classes';
import { ChangeMethod } from '@/src/entities/order/model/types'

export const OrderChangeSection: FC = memo(() => {
  const { control } = useFormContext<OrderSchemaValues>();
  const changeMode = useWatch({ control, name: 'changeMethod' });

  const {
    cnRadioWrapper,
    cnRadioRows,
    cnRadioLabel,
    cnRadioSection,
    cnRadioInput,
    cnRadioInputField,
  } = getClasses({});

  return (
    <div className={cnRadioWrapper}>
      <p className={cnRadioLabel}>Сдача</p>
      <div className={cnRadioRows}>
        <Radio.RadioGroupField
          control={control}
          name="changeMethod"
          options={[
            { value: ChangeMethod.WithoutChange, label: 'Без сдачи' },
            { value: ChangeMethod.WithChange, label: 'Сдача с' },
          ]}
          className={cnRadioSection}
        />
        {changeMode === ChangeMethod.WithChange && (
          <div className={cnRadioInput}>
            <InputDefaultField
              className={cnRadioInputField}
              control={control}
              name="changeFrom"
              placeholder="0"
              type="number"
            />
          </div>
        )}
      </div>
    </div>
  );
});

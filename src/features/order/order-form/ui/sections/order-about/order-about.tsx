'use client';

import { WithClassNames } from '@/src/shared/types';
import { InputDefaultField } from '@/src/shared/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { OrderSchemaValues } from '../../../model';
import { getClasses } from './styles/get-classes';

export const OrderAboutSection: FC<WithClassNames> = ({ className }) => {
  const { control } = useFormContext<OrderSchemaValues>();
  const { cnAbout, cnAboutLabel, cnAboutInputs } = getClasses({ className });

  return (
    <div className={cnAbout}>
      <p className={cnAboutLabel}>О вас</p>
      <div className={cnAboutInputs}>
        <InputDefaultField
          control={control}
          name="name"
          label="Имя*"
          placeholder="Алексей"
        />
        <InputDefaultField
          control={control}
          name="phone"
          label="Телефон*"
          placeholder="+7"
        />
        <InputDefaultField
          control={control}
          name="email"
          label="Почта"
          placeholder="mail@gmail.com"
        />
      </div>
    </div>
  );
};

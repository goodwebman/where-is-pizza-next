'use client';

import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { TextareaField } from '@/src/shared/ui';
import { OrderSchemaValues } from '../../../model';
import { getClasses } from './styles/get-classes';
import { WithClassNames } from '@/src/shared/types';

export const OrderCommentSection: FC<WithClassNames> = ({ className }) => {
  const { control } = useFormContext<OrderSchemaValues>();
  const { cnComment, cnCommentLabel } = getClasses({ className });

  return (
    <div className={cnComment}>
      <p className={cnCommentLabel}>Комментарий</p>
      <TextareaField control={control} name="comment" placeholder="Есть уточнения?" />
    </div>
  );
};
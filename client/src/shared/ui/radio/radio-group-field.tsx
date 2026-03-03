'use client';

import { Radio } from '@/src/shared/ui/radio';
import { FC } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  className?: string;
};

const RadioGroupFieldInner = <T extends FieldValues>({
  name,
  control,
  options,
  className,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Radio.Container className={className}>
          {options.map(opt => (
            <Radio.Button
              key={opt.value}
              label={opt.label}
              checked={field.value === opt.value}
              onChange={() => field.onChange(opt.value)}
            />
          ))}
        </Radio.Container>
      )}
    />
  );
};

export const RadioGroupField = RadioGroupFieldInner as <T extends FieldValues>(
  props: Props<T>,
) => ReturnType<FC>;

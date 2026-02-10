import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { BaseInputProps } from '../base-input/base-input';
import { InputDefault } from './input-default'

export function InputDefaultField<T extends FieldValues>({
  name,
  control,
  ...props
}: UseControllerProps<T> & BaseInputProps) {
  const {
    field,
    fieldState: { error },
  } = useController<T>({ name, control });

  return <InputDefault {...props} {...field} errorMessage={error?.message} />
}

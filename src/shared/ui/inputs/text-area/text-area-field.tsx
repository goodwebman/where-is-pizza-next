import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { BaseTextareaProps } from './base-text-area';
import { TextareaDefault } from './text-area-input';

export function TextareaField<T extends FieldValues>({
  name,
  control,
  ...props
}: UseControllerProps<T> & BaseTextareaProps) {
  const {
    field,
    fieldState: { error },
  } = useController<T>({ name, control });

  return (
    <TextareaDefault {...props} {...field} errorMessage={error?.message} />
  );
}

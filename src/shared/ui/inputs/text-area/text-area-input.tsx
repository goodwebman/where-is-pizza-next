import { forwardRef } from 'react';
import { BaseTextarea, BaseTextareaProps } from '../text-area/base-text-area';

export const TextareaDefault = forwardRef<
  HTMLTextAreaElement,
  BaseTextareaProps
>((props, ref) => {
  return <BaseTextarea {...props} ref={ref} />;
});

TextareaDefault.displayName = 'TextareaDefault';

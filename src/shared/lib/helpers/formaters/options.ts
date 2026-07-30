import { SelectedOptions } from '@/src/entities/cart';

export const getOptionsText = (selectedOptions?: SelectedOptions): string => {
  return Object.entries(selectedOptions ?? {})
    .map(([optionTitle, values]) => {
      if (!values?.length) return null;
      return `${optionTitle}: ${values.join(', ')}`;
    })
    .filter(Boolean)
    .join(' | ');
};

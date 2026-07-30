import { Ingredients } from '@/src/entities/product/model/types';

export function parseIngredientsToString(
  ingredients: Ingredients[] | string,
): string {
  if (typeof ingredients === 'string') {
    try {
      const parsed = JSON.parse(ingredients);
      if (Array.isArray(parsed)) {
        if (parsed.every(i => typeof i === 'object' && 'label' in i)) {
          return parsed.map((i: { label: string }) => i.label).join(', ');
        }
        if (parsed.every(i => typeof i === 'string')) {
          return parsed.join(', ');
        }
      }
      return '';
    } catch {
      return '';
    }
  }

  return ingredients.map(i => i.label).join(', ');
}

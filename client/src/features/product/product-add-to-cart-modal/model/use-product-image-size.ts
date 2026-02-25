import { ProductDetails } from '@/src/entities/product/model/types';
import { useMemo } from 'react';

type Selected = Record<string, string[]>;
const SIZE_TITLES = ['размер', 'размер порции', 'объём', 'size', 'volume'];

const sizeMap: Record<string, Record<string, number>> = {
  pizza: { '25': 300, '30': 350, '35': 400 },
  sushi: { '6': 400, '8': 400, '12': 400 },
  drinks: { '0.3': 180, '0.5': 220, '1': 260 },
};

export const useProductImageSize = (
  product: ProductDetails,
  selected: Selected,
) => {
  return useMemo(() => {
    const sizeOption = product.options?.find(o =>
      SIZE_TITLES.includes(o.title.trim().toLowerCase()),
    );

    if (!sizeOption) return { width: 180, height: 180 };

    const selectedId = selected[sizeOption.id]?.[0];
    const value = sizeOption.values.find(v => v.id === selectedId);
    const slug = value?.slug;

    const w = sizeMap[product.categoryId]?.[slug ?? ''] ?? 180;

    return { width: w, height: w };
  }, [product, selected]);
};

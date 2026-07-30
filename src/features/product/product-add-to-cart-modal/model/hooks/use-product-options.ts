'use client';

import { SelectedOptions } from '@/src/entities/cart/model/types';
import {
  ProductDetails,
  ProductOption,
} from '@/src/entities/product/model/types';
import { useCallback, useMemo, useState } from 'react';

export const useProductOptions = (product: ProductDetails) => {
  const [selected, setSelected] = useState<SelectedOptions>(() => {
    const initialSelected: SelectedOptions = {};

    product.options?.forEach(option => {
      if (option.values.length > 0) {
        if (option.type === 'single') {
          initialSelected[option.id] = [option.values[0].id];
        } else if (option.type === 'multiple') {
          initialSelected[option.id] = option.required
            ? [option.values[0].id]
            : [];
        }
      }
    });

    return initialSelected;
  });

  const handleOptionClick = useCallback(
    (option: ProductOption, valueId: string) => {
      setSelected(prev => {
        const current = prev[option.id] ?? [];

        if (option.type === 'multiple') {
          const newValues = current.includes(valueId)
            ? current.filter(v => v !== valueId)
            : [...current, valueId];
          return { ...prev, [option.id]: newValues };
        } else {
          return { ...prev, [option.id]: [valueId] };
        }
      });
    },
    [],
  );

  const totalPrice = useMemo(() => {
    return (
      product.price +
      Object.entries(selected).reduce((sum, [optionId, valueIds]) => {
        const option = product.options?.find(o => o.id === optionId);
        if (!option) return sum;

        valueIds.forEach(valueId => {
          const value = option.values.find(v => v.id === valueId);
          if (value?.price) sum += value.price;
        });

        return sum;
      }, 0)
    );
  }, [product, selected]);

  const totalWeight = useMemo(() => {
    return Object.entries(selected).reduce((sum, [optionId, valueIds]) => {
      const option = product.options?.find(o => o.id === optionId);
      if (!option) return sum;

      valueIds.forEach(valueId => {
        const value = option.values.find(v => v.id === valueId);
        if (value?.weight) sum += value.weight;
      });

      return sum;
    }, 0);
  }, [product, selected]);

  return { selected, handleOptionClick, totalPrice, totalWeight };
};

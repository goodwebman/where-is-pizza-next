import { z } from 'zod';

import { CATEGORIES } from '@/src/shared/config/categories/categories';

export const categoryIdSchema = z.enum(CATEGORIES);

/** Record<groupKey, selectedLabels[]> — AND across groups, OR within a group. */
export const productFiltersSchema = z.record(
  z.string().min(1),
  z.array(z.string().min(1)),
);

export const getProductsSchema = z.object({
  categoryId: categoryIdSchema.optional(),
  filters: productFiltersSchema.optional(),
});

export type GetProductsInput = z.infer<typeof getProductsSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;

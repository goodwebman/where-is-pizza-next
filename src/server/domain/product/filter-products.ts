import type { ProductFilters } from '@/src/shared/contracts';

export type FilterableProduct = {
  ingredients: { id: string; label: string }[];
};

/**
 * AND across filter groups, OR within a group, empty groups ignored.
 * Matching is exact equality against ingredient labels, so FILTERS_MAP values
 * must stay byte-identical to the labels written by the seed.
 *
 * Filtering happens in memory: the catalogue is 37 rows and the labels live in
 * a JSON column, so a query-level filter would buy nothing but complexity. If
 * the catalogue ever grows past a few hundred products, this is the first thing
 * to move into SQL.
 */
export const filterProducts = <T extends FilterableProduct>(
  products: readonly T[],
  filters: ProductFilters | undefined,
): T[] => {
  const groups = Object.values(filters ?? {}).filter(
    group => group.length > 0,
  );

  if (groups.length === 0) return [...products];

  return products.filter(product => {
    const labels = new Set(product.ingredients.map(i => i.label));
    return groups.every(group => group.some(label => labels.has(label)));
  });
};

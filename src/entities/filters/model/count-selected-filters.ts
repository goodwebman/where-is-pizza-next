import { FiltersMap } from './types';

/**
 * Total number of chosen options across every group — what the user thinks of
 * as "how many filters do I have on right now", not how many groups are touched.
 */
export const countSelectedFilters = (filters?: FiltersMap): number => {
  if (!filters) return 0;

  return Object.values(filters).reduce(
    (total, options) => total + options.length,
    0,
  );
};

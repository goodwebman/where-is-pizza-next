import { QUERY_KEYS } from '@/src/shared/api';
import { useQuery } from '@tanstack/react-query';
import { filtersApi } from '../api/filters.api';
import { FiltersMap } from '../model/types';

export const usePizzaFiltersQuery = () => {
  return useQuery<FiltersMap>({
    queryKey: [QUERY_KEYS.FILTERS, QUERY_KEYS.PIZZA],
    queryFn: filtersApi.getPizzaFilters,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSushiFiltersQuery = () => {
  return useQuery<FiltersMap>({
    queryKey: [QUERY_KEYS.FILTERS, QUERY_KEYS.SUSHI],
    queryFn: filtersApi.getSushiFilters,
    staleTime: 1000 * 60 * 5,
  });
};

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';

import { orderApi } from '@/src/entities/order/api/order.api';
import { OrdersResponse } from '@/src/entities/order/model/types';
import { QUERY_KEYS } from '@/src/shared/api';

interface UseOrdersHistoryParams {
  page: number;
  limit?: number;
}

export const useOrdersHistory = ({
  page,
  limit = 5,
}: UseOrdersHistoryParams) => {
  const queryClient = useQueryClient();

  const query = useQuery<OrdersResponse>({
    queryKey: [QUERY_KEYS.ORDER, page, limit],

    queryFn: () =>
      orderApi.getMyOrders({
        page,
        limit,
      }),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 2,
  });

  /**
   * Prefetch next page
   */
  useEffect(() => {
    if (!query.data) return;

    const totalPages = Math.ceil(query.data.total / limit);

    if (page < totalPages) {
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEYS.ORDER, page + 1, limit],

        queryFn: () =>
          orderApi.getMyOrders({
            page: page + 1,
            limit,
          }),
      });
    }
  }, [page, limit, query.data, queryClient]);

  return query;
};

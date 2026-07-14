'use client';

import { FC } from 'react';

import { OrderCard } from '@/src/entities/order/ui/order-card/order-card';
import { WithClassNames } from '@/src/shared/types';

import {
  useOrderPagination,
  Pagination,
} from '@/src/features/order/order-pagination';

import { useOrdersHistory } from '../model/use-orders-history';
import { getClasses } from './styles/get-classes';

const LIMIT = 5;

export const ProfileOrdersHistory: FC<WithClassNames> = ({ className }) => {
  const { cnContainer } = getClasses({ className });

  const { page, setPage, pages, totalPages } = useOrderPagination({
    total: 0,
    perPage: LIMIT,
  });

  const ordersQuery = useOrdersHistory({
    page,
    limit: LIMIT,
  });

  const total = ordersQuery.data?.total ?? 0;

  const orders = ordersQuery.data?.items ?? [];

  if (ordersQuery.isLoading && !ordersQuery.data) {
    return <div className={cnContainer}>Загрузка...</div>;
  }

  if (!orders.length) {
    return (
      <div className={cnContainer}>
        <p>У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <div className={cnContainer}>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}

      <Pagination
        page={page}
        totalPages={totalPages}
        pages={pages}
        onPageChange={setPage}
      />
    </div>
  );
};

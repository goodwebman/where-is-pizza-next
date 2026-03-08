'use client';

import { FC, useEffect } from 'react';

import { OrderCard } from '@/src/entities/order/ui/order-card/order-card';
import { WithClassNames } from '@/src/shared/types';

import { useOrderPagination } from '@/src/features/order/order-pagination/model/use-order-pagination';


import { getClasses } from './styles/get-classes';
import { useOrdersHistory } from '../model/use-orders-history'

const LIMIT = 2;

export const ProfileOrdersHistory: FC<WithClassNames> = ({ className }) => {
  const { cnContainer } = getClasses({ className });

  const pagination = useOrderPagination({
    total: 0,
    perPage: LIMIT,
  });

  const ordersQuery = useOrdersHistory({
    page: pagination.page,
    limit: LIMIT,
  });

  const orders = ordersQuery.data?.items ?? [];
  const total = ordersQuery.data?.total ?? 0;


  useEffect(() => {
    pagination.setTotal(total);
  }, [total]);

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

      <pagination.Pagination />
    </div>
  );
};
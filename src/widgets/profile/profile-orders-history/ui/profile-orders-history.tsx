'use client';

import { FC, useState } from 'react';

import { OrderCard } from '@/src/entities/order/ui/order-card/order-card';
import { useIsAuthorized } from '@/src/entities/session';
import { WithClassNames } from '@/src/shared/types';

import {
  Pagination,
  getPaginationRange,
} from '@/src/features/order/order-pagination';

import { useOrdersHistory } from '../model/use-orders-history';
import { getClasses } from './styles/get-classes';

const LIMIT = 5;

export const ProfileOrdersHistory: FC<WithClassNames> = ({ className }) => {
  const { cnContainer, cnMessage, cnHint } = getClasses({ className });
  const isAuthorized = useIsAuthorized();

  const [page, setPage] = useState(1);

  const ordersQuery = useOrdersHistory({
    page,
    limit: LIMIT,
  });

  const orders = ordersQuery.data?.items ?? [];

  const { pages, totalPages } = getPaginationRange({
    page,
    total: ordersQuery.data?.total ?? 0,
    perPage: LIMIT,
  });

  if (ordersQuery.isLoading && !ordersQuery.data) {
    return <div className={cnContainer}>Загрузка...</div>;
  }

  if (ordersQuery.isError) {
    return (
      <div className={cnContainer}>
        <p className={cnMessage}>Не удалось загрузить историю заказов</p>
        <p className={cnHint}>Попробуйте обновить страницу.</p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className={cnContainer}>
        <p className={cnMessage}>У вас пока нет заказов</p>

        {/*
          A guest only ever sees orders tied to the guest cookie of this browser,
          so an empty list here does not mean the account has none.
        */}
        {!isAuthorized && (
          <p className={cnHint}>
            Здесь показаны заказы, оформленные в этом браузере. Войдите в
            аккаунт, чтобы увидеть всю историю.
          </p>
        )}
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

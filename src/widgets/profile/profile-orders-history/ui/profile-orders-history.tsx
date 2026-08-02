'use client';

import { FC, useState } from 'react';

import { OrderCard } from '@/src/entities/order/ui/order-card/order-card';
import { useIsAuthorized } from '@/src/entities/session';
import { WithClassNames } from '@/src/shared/types';
import { Buttons, EmptyState } from '@/src/shared/ui';

import {
  Pagination,
  getPaginationRange,
} from '@/src/features/order/order-pagination';

import cartEmptyImg from '@/public/images/cart-empty.png';
import errorImg from '@/public/images/error.png';
import { ROUTES } from '@/src/shared/config';
import { Skeleton } from '@/src/shared/ui/skeleton/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { useOrdersHistory } from '../model/use-orders-history';
import { getClasses } from './styles/get-classes';

const LIMIT = 5;

export const ProfileOrdersHistory: FC<WithClassNames> = ({ className }) => {
  const { cnContainer, cnSkeleton, cnLink } = getClasses({ className });
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
    return (
      <div className={cnContainer}>
        {/* Card-shaped placeholders instead of the old "Загрузка..." line, so the
            page does not visibly jump when the orders land. */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} variant="superellipse" className={cnSkeleton} />
        ))}
      </div>
    );
  }

  if (ordersQuery.isError) {
    return (
      <div className={cnContainer}>
        <EmptyState
          media={<Image src={errorImg} alt="" width={96} height={96} />}
          title="Не удалось загрузить заказы"
          description="Похоже, что-то со связью. Попробуйте ещё раз — история никуда не денется."
          action={
            <Buttons.DefaultButton
              onClick={() => ordersQuery.refetch()}
              isLoading={ordersQuery.isFetching}
            >
              Попробовать снова
            </Buttons.DefaultButton>
          }
        />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className={cnContainer}>
        <EmptyState
          media={<Image src={cartEmptyImg} alt="" width={180} height={180} />}
          title="Заказов пока нет"
          description={
            // A guest only ever sees orders tied to the guest cookie of this
            // browser, so an empty list here does not mean the account has none.
            isAuthorized
              ? 'Как только вы что-нибудь закажете, история появится здесь.'
              : 'Здесь показаны заказы, оформленные в этом браузере. Войдите в аккаунт, чтобы увидеть всю историю.'
          }
          action={
            <Link href={ROUTES.HOME} className={cnLink}>
              Перейти к меню
            </Link>
          }
        />
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

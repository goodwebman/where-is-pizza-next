'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { ROUTES } from '@/src/shared/config';
import { Buttons } from '@/src/shared/ui';
import { getClasses } from './styles/get-classes';

type OrderSuccessProps = {
  orderId: string;
  eta?: number;
  className?: string;
};

export const OrderSuccess: FC<OrderSuccessProps> = ({
  orderId,
  eta = 45,
  className,
}) => {
  const router = useRouter();
  const { cnRoot, cnImage, cnTitle, cnSubtitle, cnButton } = getClasses({
    className,
  });

  const handleTrackOrders = () => {
    router.push(`${ROUTES.PROFILE.ORDERS}?orderId=${orderId}`);
  };

  return (
    <section className={cnRoot} aria-live="polite">
      <Image
        src="/images/order-submitted.png"
        alt="Заказ принят"
        width={280}
        height={200}
        className={cnImage}
        priority
      />    

      <h1 className={cnTitle}>Заказ №{orderId} принят</h1>

      <p className={cnSubtitle}>
        Спасибо за заказ! <br />
        Примерное время доставки {eta} минут. <br />
        Статус можно отследить нажав на кнопку ниже
      </p>

      <Buttons.DefaultButton className={cnButton} onClick={handleTrackOrders}>
        Отследить заказ
      </Buttons.DefaultButton>
    </section>
  );
};

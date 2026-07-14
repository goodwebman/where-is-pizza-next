'use client';

import {
  ChangeMethod,
  CreateOrderDTO,
  DeliveryMode,
  DeliveryTime,
  PaymentMethod,
} from '@/src/entities/order/model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { orderSchema, OrderSchemaValues, useOrderSubmit } from '../../model';
import { OrderAboutSection } from '../sections/order-about/order-about';
import { OrderChangeSection } from '../sections/order-change/order-change';
import { OrderCommentSection } from '../sections/order-comment/order-comment';
import { OrderDeliveryTimeSection } from '../sections/order-delivery-time/order-delivery-time';
import { OrderDeliverySection } from '../sections/order-delivery/order-delivery';
import { OrderPaymentSection } from '../sections/order-payment/order-payment';
import { OrderSubmitSection } from '../sections/order-submit/order-submit';
import { getClasses } from './styles/get-classes';

type OrderFormProps = {
  fullPrice: number;
  totalItems: number;
};

export const OrderForm: FC<OrderFormProps> = ({ fullPrice, totalItems }) => {
  const methods = useForm<OrderSchemaValues>({
    resolver: zodResolver(orderSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      deliveryMode: DeliveryMode.Delivery,
      deliveryTime: DeliveryTime.ASAP,
      address: {
        street: '',
        house: '',
        entrance: '',
        floor: '',
        apartment: '',
        intercom: '',
      },
      scheduledDate: '',
      scheduledTime: '',
      restaurantId: '',
      paymentMethod: PaymentMethod.Cash,
      changeMethod: ChangeMethod.WithoutChange,
      changeFrom: '0',
      comment: '',
    },
  });

  const { handleSubmit } = methods;

  const { submitOrder, isLoading } = useOrderSubmit();
  const onSubmit = (data: CreateOrderDTO) => {
    submitOrder(data);
  };

  const { cnRoot } = getClasses({});

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={cnRoot}>
        <OrderAboutSection />
        <OrderDeliverySection />
        <OrderDeliveryTimeSection />
        <OrderPaymentSection />
        <OrderChangeSection />
        <OrderCommentSection />
        <OrderSubmitSection
          fullPrice={fullPrice}
          totalItems={totalItems}
          isPending={isLoading}
        />
      </form>
    </FormProvider>
  );
};

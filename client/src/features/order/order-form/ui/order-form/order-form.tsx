'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  ChangeMethod,
  DeliveryMode,
  DeliveryTime,
  orderSchema,
  OrderSchemaValues,
  PaymentMethod,
} from '../../model';
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
};

export const OrderForm: FC<OrderFormProps> = ({ fullPrice }) => {
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

  const onSubmit = (data: OrderSchemaValues) => {
    console.log('SUCCESS', data);
  };

  const onError = (errors: any) => {
    console.log('FORM ERRORS', errors);
  };
  const { cnRoot } = getClasses({});

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className={cnRoot}>
        <OrderAboutSection />
        <OrderDeliverySection />
        <OrderDeliveryTimeSection />
        <OrderPaymentSection />
        <OrderChangeSection />
        <OrderCommentSection />
        <OrderSubmitSection fullPrice={fullPrice} />
      </form>
    </FormProvider>
  );
};

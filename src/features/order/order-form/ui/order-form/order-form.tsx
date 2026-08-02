'use client';

import {
  ChangeMethod,
  CreateOrderDTO,
  DeliveryMode,
  DeliveryTime,
  PaymentMethod,
} from '@/src/entities/order/model/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { FC } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
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

  const { handleSubmit, control } = methods;

  const paymentMethod = useWatch({ control, name: 'paymentMethod' });
  // Change only exists for cash. Derived at render — no effect resetting form
  // state behind the user's back.
  const isCashPayment = paymentMethod === PaymentMethod.Cash;

  const { submitOrder, isLoading } = useOrderSubmit();

  const onSubmit = (data: CreateOrderDTO) => {
    // The change fields keep whatever the customer typed before switching to a
    // card, so they are normalised here rather than wiped on switch — going back
    // to "Наличными" restores the previous choice.
    submitOrder(
      isCashPayment
        ? data
        : {
            ...data,
            changeMethod: ChangeMethod.WithoutChange,
            changeFrom: undefined,
          },
    );
  };

  const { cnRoot } = getClasses({});

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className={cnRoot}>
        <OrderAboutSection />
        <OrderDeliverySection />
        <OrderDeliveryTimeSection />
        <OrderPaymentSection />

        {/* Collapsing rather than snapping: the section sits mid-form, so a hard
            unmount jumps everything below it up by its full height. */}
        <AnimatePresence initial={false}>
          {isCashPayment && (
            <motion.div
              key="order-change"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <OrderChangeSection />
            </motion.div>
          )}
        </AnimatePresence>
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

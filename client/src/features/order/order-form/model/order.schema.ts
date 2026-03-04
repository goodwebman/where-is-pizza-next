import { ChangeMethod, DeliveryMode, DeliveryTime, PaymentMethod } from '@/src/entities/order/model/types'
import { z } from 'zod';

export const orderSchema = z
  .object({
    name: z.string().min(1, 'Введите имя'),
    phone: z
      .string()
      .min(1, 'Введите телефон')
      .regex(
        /^[78]\d{10}$/,
        'Неверный формат телефона. Пример: 89659862820 или 79659862820',
      ),
    email: z.string().email('Введите почту'),

    deliveryMode: z.nativeEnum(DeliveryMode),
    deliveryTime: z.nativeEnum(DeliveryTime),

    address: z
      .object({
        street: z.string().min(1, 'Улица обязательна'),
        house: z.string().min(1, 'Дом обязателен'),
        entrance: z.string().min(1, 'Подъезд обязателен'),
        floor: z.string().min(1, 'Этаж обязателен'),
        apartment: z.string().min(1, 'Квартира обязательна'),
        intercom: z.string().min(1, 'Домофон обязателен'),
      })
      .optional(),

    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),

    restaurantId: z.string().optional(),

    paymentMethod: z.nativeEnum(PaymentMethod),
    changeMethod: z.nativeEnum(ChangeMethod),
    changeFrom: z.string().max(10000).optional(),

    comment: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Если доставка — ресторан не нужен
    if (data.deliveryMode === DeliveryMode.Pickup && !data.restaurantId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['restaurantId'],
        message: 'Для самовывоза необходимо выбрать ресторан',
      });
    }

    // Если ASAP — не нужно указывать дату и время
    if (data.deliveryTime !== DeliveryTime.ASAP) {
      if (!data.scheduledDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['scheduledDate'],
          message: 'Укажите дату доставки',
        });
      }
      if (
        !data.scheduledTime ||
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.scheduledTime)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['scheduledTime'],
          message: 'Укажите корректное время доставки',
        });
      }
    }

    // Если без сдачи — не нужно указывать changeFrom
    if (data.changeMethod !== ChangeMethod.WithoutChange && !data.changeFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['changeFrom'],
        message: 'Укажите сумму для сдачи',
      });
    }
  });

export type OrderSchemaValues = z.infer<typeof orderSchema>;

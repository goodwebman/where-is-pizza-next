import { z } from 'zod';

/**
 * Wire values (lowercase) as the client sends them. The database uses its own
 * PascalCase enums; translation lives in server/domain/order/map-enums and
 * throws on anything unmapped, instead of silently producing `undefined` and
 * failing later with a 500.
 */
export enum DeliveryMode {
  Delivery = 'delivery',
  Pickup = 'pickup',
}

export enum DeliveryTime {
  ASAP = 'asap',
  Scheduled = 'scheduled',
}

export enum PaymentMethod {
  Cash = 'cash',
  Card = 'card',
  ApplePay = 'applePay',
}

export enum ChangeMethod {
  WithoutChange = 'withoutChange',
  WithChange = 'withChange',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export const addressSchema = z.object({
  street: z.string().min(1, 'Улица обязательна'),
  house: z.string().min(1, 'Дом обязателен'),
  entrance: z.string().min(1, 'Подъезд обязателен'),
  floor: z.string().min(1, 'Этаж обязателен'),
  apartment: z.string().min(1, 'Квартира обязательна'),
  intercom: z.string().min(1, 'Домофон обязателен'),
});

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Shared by the checkout form and POST /api/orders, so the browser and the
 * server can never disagree about what a valid order looks like.
 */
export const createOrderSchema = z
  .object({
    name: z.string().min(1, 'Введите имя').max(100),
    phone: z
      .string()
      .min(1, 'Введите телефон')
      .regex(
        /^[78]\d{10}$/,
        'Неверный формат телефона. Пример: 89659862820 или 79659862820',
      ),
    email: z.email({ message: 'Введите почту' }),

    deliveryMode: z.enum(DeliveryMode),
    deliveryTime: z.enum(DeliveryTime),

    address: addressSchema.optional(),

    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),

    restaurantId: z.string().optional(),

    paymentMethod: z.enum(PaymentMethod),
    changeMethod: z.enum(ChangeMethod),
    changeFrom: z.string().max(10000).optional(),

    comment: z.string().max(1000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMode === DeliveryMode.Pickup && !data.restaurantId) {
      ctx.addIssue({
        code: 'custom',
        path: ['restaurantId'],
        message: 'Для самовывоза необходимо выбрать ресторан',
      });
    }

    if (data.deliveryTime !== DeliveryTime.ASAP) {
      if (!data.scheduledDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['scheduledDate'],
          message: 'Укажите дату доставки',
        });
      }

      if (!data.scheduledTime || !TIME_PATTERN.test(data.scheduledTime)) {
        ctx.addIssue({
          code: 'custom',
          path: ['scheduledTime'],
          message: 'Укажите корректное время доставки',
        });
      }
    }

    if (data.changeMethod !== ChangeMethod.WithoutChange && !data.changeFrom) {
      ctx.addIssue({
        code: 'custom',
        path: ['changeFrom'],
        message: 'Укажите сумму для сдачи',
      });
    }
  });

export const getOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(5),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;
export type Address = z.infer<typeof addressSchema>;

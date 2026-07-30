import { describe, expect, it } from 'vitest';

import {
  ChangeMethod,
  DeliveryMode,
  DeliveryTime,
  PaymentMethod,
  createOrderSchema,
  getOrdersQuerySchema,
  type CreateOrderInput,
} from './order.contract';

const validBase: CreateOrderInput = {
  name: 'Иван',
  phone: '89659862820',
  email: 'test@example.com',
  deliveryMode: DeliveryMode.Delivery,
  deliveryTime: DeliveryTime.ASAP,
  paymentMethod: PaymentMethod.Cash,
  changeMethod: ChangeMethod.WithoutChange,
  comment: '',
};

const issuePaths = (result: ReturnType<typeof createOrderSchema.safeParse>) =>
  result.success ? [] : result.error.issues.flatMap(issue => issue.path);

describe('createOrderSchema', () => {
  it('passes with delivery + ASAP + cash without change', () => {
    expect(createOrderSchema.safeParse(validBase).success).toBe(true);
  });

  it('fails when name is empty', () => {
    const result = createOrderSchema.safeParse({ ...validBase, name: '' });

    expect(result.success).toBe(false);
    expect(issuePaths(result)).toContain('name');
  });

  it('fails with an invalid phone format', () => {
    expect(
      createOrderSchema.safeParse({ ...validBase, phone: '123' }).success,
    ).toBe(false);
    expect(
      createOrderSchema.safeParse({ ...validBase, phone: '19659862820' })
        .success,
    ).toBe(false);
  });

  it('fails with a bad email', () => {
    expect(
      createOrderSchema.safeParse({ ...validBase, email: 'not-an-email' })
        .success,
    ).toBe(false);
  });

  it('requires restaurantId for pickup', () => {
    const result = createOrderSchema.safeParse({
      ...validBase,
      deliveryMode: DeliveryMode.Pickup,
    });

    expect(result.success).toBe(false);
    expect(issuePaths(result)).toContain('restaurantId');
  });

  it('passes pickup with a restaurant', () => {
    expect(
      createOrderSchema.safeParse({
        ...validBase,
        deliveryMode: DeliveryMode.Pickup,
        restaurantId: 'rest-1',
      }).success,
    ).toBe(true);
  });

  it('requires a date and a time for a scheduled delivery', () => {
    const result = createOrderSchema.safeParse({
      ...validBase,
      deliveryTime: DeliveryTime.Scheduled,
    });

    expect(result.success).toBe(false);
    expect(issuePaths(result)).toContain('scheduledDate');
    expect(issuePaths(result)).toContain('scheduledTime');
  });

  it('rejects a malformed scheduled time', () => {
    const result = createOrderSchema.safeParse({
      ...validBase,
      deliveryTime: DeliveryTime.Scheduled,
      scheduledDate: '2026-08-01',
      scheduledTime: '25:00',
    });

    expect(result.success).toBe(false);
    expect(issuePaths(result)).toContain('scheduledTime');
  });

  it('requires changeFrom when change is expected', () => {
    const result = createOrderSchema.safeParse({
      ...validBase,
      changeMethod: ChangeMethod.WithChange,
      changeFrom: '',
    });

    expect(result.success).toBe(false);
    expect(issuePaths(result)).toContain('changeFrom');
  });

  it('passes with card payment and no change', () => {
    expect(
      createOrderSchema.safeParse({
        ...validBase,
        paymentMethod: PaymentMethod.Card,
        changeMethod: ChangeMethod.WithoutChange,
      }).success,
    ).toBe(true);
  });

  it('fails when a supplied address is blank', () => {
    expect(
      createOrderSchema.safeParse({
        ...validBase,
        address: {
          street: '',
          house: '',
          entrance: '',
          floor: '',
          apartment: '',
          intercom: '',
        },
      }).success,
    ).toBe(false);
  });

  it('rejects an unknown enum value outright', () => {
    expect(
      createOrderSchema.safeParse({ ...validBase, deliveryMode: 'teleport' })
        .success,
    ).toBe(false);
    expect(
      createOrderSchema.safeParse({ ...validBase, paymentMethod: 'bitcoin' })
        .success,
    ).toBe(false);
  });

  it('accepts applePay as a payment method', () => {
    expect(
      createOrderSchema.safeParse({
        ...validBase,
        paymentMethod: PaymentMethod.ApplePay,
      }).success,
    ).toBe(true);
  });
});

describe('getOrdersQuerySchema', () => {
  it('defaults to the first page', () => {
    expect(getOrdersQuerySchema.parse({})).toEqual({ page: 1, limit: 5 });
  });

  it('coerces query strings to numbers', () => {
    expect(getOrdersQuerySchema.parse({ page: '3', limit: '10' })).toEqual({
      page: 3,
      limit: 10,
    });
  });

  it('rejects nonsense paging', () => {
    expect(getOrdersQuerySchema.safeParse({ page: 0 }).success).toBe(false);
    expect(getOrdersQuerySchema.safeParse({ limit: 1000 }).success).toBe(false);
    expect(getOrdersQuerySchema.safeParse({ page: 'abc' }).success).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { orderSchema, OrderSchemaValues } from './order.schema';
import { DeliveryMode, DeliveryTime, PaymentMethod, ChangeMethod } from '@/src/entities/order/model/types';

const validBase: OrderSchemaValues = {
  name: 'Иван',
  phone: '89659862820',
  email: 'test@example.com',
  deliveryMode: DeliveryMode.Delivery,
  deliveryTime: DeliveryTime.ASAP,
  paymentMethod: PaymentMethod.Cash,
  changeMethod: ChangeMethod.WithoutChange,
  comment: '',
};

describe('orderSchema', () => {
  it('passes with valid delivery + ASAP + cash without change', () => {
    const result = orderSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it('fails when name is empty', () => {
    const result = orderSchema.safeParse({ ...validBase, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name');
    }
  });

  it('fails with invalid phone format', () => {
    const result = orderSchema.safeParse({ ...validBase, phone: '123' });
    expect(result.success).toBe(false);
  });

  it('fails with bad email', () => {
    const result = orderSchema.safeParse({ ...validBase, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('requires restaurantId for pickup', () => {
    const result = orderSchema.safeParse({
      ...validBase,
      deliveryMode: DeliveryMode.Pickup,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('restaurantId'))).toBe(true);
    }
  });

  it('passes pickup with valid restaurant', () => {
    const result = orderSchema.safeParse({
      ...validBase,
      deliveryMode: DeliveryMode.Pickup,
      restaurantId: 'rest-1',
    });
    expect(result.success).toBe(true);
  });

  it('requires scheduledDate for non-ASAP delivery', () => {
    const result = orderSchema.safeParse({
      ...validBase,
      deliveryTime: DeliveryTime.Scheduled,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('scheduledDate'))).toBe(true);
    }
  });

  it('requires changeFrom when paying with cash and change needed', () => {
    const result = orderSchema.safeParse({
      ...validBase,
      changeMethod: ChangeMethod.WithChange,
      changeFrom: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('changeFrom'))).toBe(true);
    }
  });

  it('passes with card payment (no change needed)', () => {
    const result = orderSchema.safeParse({
      ...validBase,
      paymentMethod: PaymentMethod.Card,
      changeMethod: ChangeMethod.WithoutChange,
    });
    expect(result.success).toBe(true);
  });

  it('fails when address is empty in delivery mode', () => {
    const result = orderSchema.safeParse({
      ...validBase,
      deliveryMode: DeliveryMode.Delivery,
      address: {
        street: '',
        house: '',
        entrance: '',
        floor: '',
        apartment: '',
        intercom: '',
      },
    });
    expect(result.success).toBe(false);
  });
});

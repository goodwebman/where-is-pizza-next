import { describe, expect, it } from 'vitest';

import { AppError } from '@/src/server/http/errors';
import {
  ChangeMethod,
  DeliveryMode,
  DeliveryTime,
  PaymentMethod,
} from '@/src/shared/contracts';
import {
  toDbChangeMethod,
  toDbDeliveryMode,
  toDbDeliveryTime,
  toDbPaymentMethod,
  toWireDeliveryMode,
  toWirePaymentMethod,
} from './map-enums';

describe('order enum mapping', () => {
  it('maps wire values to database values', () => {
    expect(toDbDeliveryMode(DeliveryMode.Delivery)).toBe('Delivery');
    expect(toDbDeliveryMode(DeliveryMode.Pickup)).toBe('Pickup');
    expect(toDbDeliveryTime(DeliveryTime.ASAP)).toBe('ASAP');
    expect(toDbDeliveryTime(DeliveryTime.Scheduled)).toBe('Scheduled');
    expect(toDbPaymentMethod(PaymentMethod.Cash)).toBe('Cash');
    expect(toDbChangeMethod(ChangeMethod.WithChange)).toBe('WithChange');
  });

  it('collapses applePay onto Card', () => {
    expect(toDbPaymentMethod(PaymentMethod.ApplePay)).toBe('Card');
  });

  it('throws a 400 on an unmapped value', () => {
    // The old controller returned undefined here, which reached Prisma and
    // surfaced as a 500 — a malformed request looking like a server fault.
    expect(() => toDbDeliveryMode('teleport')).toThrowError(AppError);
    expect(() => toDbDeliveryTime('someday')).toThrowError(/deliveryTime/);
    expect(() => toDbPaymentMethod('bitcoin')).toThrowError(/paymentMethod/);
    expect(() => toDbChangeMethod('maybe')).toThrowError(/changeMethod/);

    try {
      toDbDeliveryMode('teleport');
      expect.unreachable('should have thrown');
    } catch (error) {
      expect((error as AppError).status).toBe(400);
    }
  });

  it('rejects the database spelling on the wire side', () => {
    expect(() => toDbDeliveryMode('Delivery')).toThrowError(AppError);
  });

  it('maps database values back to the wire', () => {
    expect(toWireDeliveryMode('Pickup')).toBe(DeliveryMode.Pickup);
    // Card came from either "card" or "applePay"; it maps back to the canonical one.
    expect(toWirePaymentMethod('Card')).toBe(PaymentMethod.Card);
  });
});

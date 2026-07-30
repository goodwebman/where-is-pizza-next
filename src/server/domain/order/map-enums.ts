import { badRequest } from '@/src/server/http/errors';
import {
  ChangeMethod,
  DeliveryMode,
  DeliveryTime,
  PaymentMethod,
} from '@/src/shared/contracts';

/**
 * Wire enum (lowercase) to database enum (PascalCase).
 *
 * The old controller looked values up in a plain object and passed the result
 * straight to Prisma, so an unknown value became `undefined` and surfaced as a
 * 500. Every lookup here throws a 400 instead — an invalid request should say
 * so, not look like a server fault.
 *
 * `applePay` collapses to `Card`: the database has no separate wallet variant,
 * and the payment is a card payment either way.
 */
const mapOrThrow = <T extends string>(
  map: Record<string, T>,
  value: string,
  field: string,
): T => {
  const mapped = map[value];

  if (!mapped) {
    throw badRequest(`Unsupported ${field}: ${value}`, 'UNSUPPORTED_ENUM_VALUE');
  }

  return mapped;
};

const deliveryModeMap: Record<string, 'Delivery' | 'Pickup'> = {
  [DeliveryMode.Delivery]: 'Delivery',
  [DeliveryMode.Pickup]: 'Pickup',
};

const deliveryTimeMap: Record<string, 'ASAP' | 'Scheduled'> = {
  [DeliveryTime.ASAP]: 'ASAP',
  [DeliveryTime.Scheduled]: 'Scheduled',
};

const paymentMethodMap: Record<string, 'Cash' | 'Card'> = {
  [PaymentMethod.Cash]: 'Cash',
  [PaymentMethod.Card]: 'Card',
  [PaymentMethod.ApplePay]: 'Card',
};

const changeMethodMap: Record<string, 'WithoutChange' | 'WithChange'> = {
  [ChangeMethod.WithoutChange]: 'WithoutChange',
  [ChangeMethod.WithChange]: 'WithChange',
};

export const toDbDeliveryMode = (value: string) =>
  mapOrThrow(deliveryModeMap, value, 'deliveryMode');

export const toDbDeliveryTime = (value: string) =>
  mapOrThrow(deliveryTimeMap, value, 'deliveryTime');

export const toDbPaymentMethod = (value: string) =>
  mapOrThrow(paymentMethodMap, value, 'paymentMethod');

export const toDbChangeMethod = (value: string) =>
  mapOrThrow(changeMethodMap, value, 'changeMethod');

const invert = <T extends string>(map: Record<string, T>) =>
  Object.entries(map).reduce<Record<string, string>>((acc, [wire, db]) => {
    // First wire value wins, so Card maps back to "card", not "applePay".
    if (!(db in acc)) acc[db] = wire;
    return acc;
  }, {});

const deliveryModeToWire = invert(deliveryModeMap);
const deliveryTimeToWire = invert(deliveryTimeMap);
const paymentMethodToWire = invert(paymentMethodMap);
const changeMethodToWire = invert(changeMethodMap);

export const toWireDeliveryMode = (value: string) =>
  deliveryModeToWire[value] as DeliveryMode;

export const toWireDeliveryTime = (value: string) =>
  deliveryTimeToWire[value] as DeliveryTime;

export const toWirePaymentMethod = (value: string) =>
  paymentMethodToWire[value] as PaymentMethod;

export const toWireChangeMethod = (value: string) =>
  changeMethodToWire[value] as ChangeMethod;

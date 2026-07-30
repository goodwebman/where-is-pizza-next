import type { Address } from '@/src/shared/contracts';

export type AddressColumns = {
  street: string | null;
  house: string | null;
  entrance: string | null;
  floor: string | null;
  apartment: string | null;
  intercom: string | null;
};

/**
 * The order table stores the address as flat nullable columns; the client works
 * with a nested object. Returns null when nothing was filled in — pickup orders
 * have no address at all, and an object of six undefineds is not the same thing.
 */
export const toAddress = (row: AddressColumns): Partial<Address> | null => {
  const entries = Object.entries(row).filter(
    ([, value]) => value !== null && value !== '',
  );

  if (entries.length === 0) return null;

  return Object.fromEntries(entries) as Partial<Address>;
};

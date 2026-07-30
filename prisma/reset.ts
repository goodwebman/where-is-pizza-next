import type { PrismaClient } from '@/src/server/db/generated/client';

/**
 * Tables holding per-run state, ordered so the list reads top-down from most to
 * least dependent. TRUNCATE ... CASCADE makes the order irrelevant to Postgres,
 * but keeping it meaningful helps when reading the reset in a test failure.
 */
const MUTABLE_TABLES = [
  'OrderItem',
  'Order',
  'CartItem',
  'Cart',
  'RefreshToken',
  'User',
] as const;

/** Reference data — only wiped by the seed, never between tests. */
const CATALOGUE_TABLES = [
  'ProductOptionValue',
  'ProductOption',
  'Nutrition',
  'Product',
] as const;

const truncate = (db: PrismaClient, tables: readonly string[]) =>
  db.$executeRawUnsafe(
    `TRUNCATE TABLE ${tables
      .map(table => `"${table}"`)
      .join(', ')} RESTART IDENTITY CASCADE`,
  );

/**
 * Clears users, carts and orders but leaves the product catalogue in place.
 * Used between integration tests: re-seeding 37 products per test would cost
 * far more than it buys, and nothing under test mutates them.
 */
export const resetMutableData = (db: PrismaClient) =>
  truncate(db, MUTABLE_TABLES);

/** Full wipe, including the catalogue. Used by the seed before re-inserting. */
export const resetAll = (db: PrismaClient) =>
  truncate(db, [...MUTABLE_TABLES, ...CATALOGUE_TABLES]);

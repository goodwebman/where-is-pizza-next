import 'server-only';

import type { PrismaClient } from './generated/client';
import type { Db } from './prisma';

/**
 * Runs `fn` in a transaction, or joins the caller's if one is already open.
 *
 * Prisma has no nested transactions, so a service that is handed a transaction
 * client must use it as-is; only a top-level call opens a new one.
 */
export const withTransaction = <T>(
  db: Db,
  fn: (tx: Db) => Promise<T>,
): Promise<T> =>
  '$transaction' in db
    ? (db as PrismaClient).$transaction(tx => fn(tx))
    : fn(db);

import 'server-only';

import { PrismaPg } from '@prisma/adapter-pg';

import { env, isProduction } from '@/src/server/config/env';
import { PrismaClient } from './generated/client';
import type { Prisma } from './generated/client';

/**
 * Anything that can run a query: the client itself, or a transaction handle.
 * Services take this as their last parameter so a caller can compose several of
 * them into one transaction without the services knowing about each other.
 */
export type Db = PrismaClient | Prisma.TransactionClient;

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: env.DATABASE_URL,
      // One connection per serverless instance: the pooled Neon endpoint
      // multiplexes on its side, and a larger local pool just burns the
      // connection limit during traffic spikes.
      max: 1,
      idleTimeoutMillis: 10_000,
      // Neon scales to zero after ~5 minutes idle; the first query afterwards
      // has to wait for the compute to wake up.
      connectionTimeoutMillis: 10_000,
    }),
    log: isProduction ? ['error'] : ['warn', 'error'],
  });

const globalForPrisma = globalThis as unknown as {
  __prisma?: PrismaClient;
};

/**
 * Held on globalThis in development because each HMR cycle re-evaluates this
 * module, and a fresh client (with a fresh pg pool) per cycle exhausts the
 * database connection limit within minutes.
 */
export const prisma = globalForPrisma.__prisma ?? createPrismaClient();

if (!isProduction) {
  globalForPrisma.__prisma = prisma;
}

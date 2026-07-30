import 'dotenv/config';

import { afterAll, beforeEach } from 'vitest';

// Must happen before anything imports server/config/env, which reads
// DATABASE_URL once at module load.
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  process.env.DIRECT_DATABASE_URL = process.env.TEST_DATABASE_URL;
}

process.env.JWT_SECRET ??= 'test-secret-'.padEnd(48, 'x');
process.env.SITE_URL ??= 'http://localhost:3000';

const { prisma } = await import('@/src/server/db/prisma');
const { resetMutableData } = await import('@/prisma/reset');

/**
 * Truncate rather than a transactional rollback: route handlers import the
 * prisma singleton directly, so a test-owned transaction could not reach them
 * without changing what production runs. Products survive — nothing under test
 * mutates the catalogue, and re-seeding 37 rows per test would dominate the
 * runtime.
 */
beforeEach(async () => {
  await resetMutableData(prisma);
});

afterAll(async () => {
  await prisma.$disconnect();
});

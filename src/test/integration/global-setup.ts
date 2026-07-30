import 'dotenv/config';

import { execFileSync } from 'node:child_process';

/**
 * Integration tests run against a real Postgres — the same engine as production,
 * because half of what they cover (unique constraints, cascades, transactions)
 * does not exist in a mock.
 *
 * Point TEST_DATABASE_URL at a throwaway database: this wipes it.
 */
export default function setup() {
  const url = process.env.TEST_DATABASE_URL;

  if (!url) {
    throw new Error(
      'TEST_DATABASE_URL is not set.\n' +
        'Start one with:\n' +
        '  docker run -d --name wip-postgres-test -e POSTGRES_PASSWORD=postgres -p 5434:5432 postgres:17-alpine\n' +
        'then set TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5434/postgres',
    );
  }

  const env = {
    ...process.env,
    DATABASE_URL: url,
    DIRECT_DATABASE_URL: url,
  };

  // Schema first, then the product catalogue: every test assumes products exist
  // and only the mutable tables are reset between them.
  execFileSync('npx', ['prisma', 'migrate', 'deploy'], {
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  execFileSync('npx', ['tsx', 'prisma/seed.ts'], {
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

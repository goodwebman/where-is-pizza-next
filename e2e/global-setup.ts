import 'dotenv/config';

import { execFileSync } from 'node:child_process';

/**
 * Schema and catalogue once per run. Individual tests isolate themselves with a
 * fresh browser context (hence a fresh guest cookie) and unique account emails,
 * so nothing has to be reset between them.
 */
export default function globalSetup() {
  const url =
    process.env.E2E_DATABASE_URL ??
    process.env.TEST_DATABASE_URL ??
    process.env.DATABASE_URL;

  if (!url) throw new Error('No database URL for e2e (set E2E_DATABASE_URL)');

  const env = { ...process.env, DATABASE_URL: url, DIRECT_DATABASE_URL: url };
  const options = {
    env,
    stdio: 'inherit' as const,
    shell: process.platform === 'win32',
  };

  execFileSync('npx', ['prisma', 'migrate', 'deploy'], options);
  execFileSync('npx', ['tsx', 'prisma/seed.ts'], options);
}

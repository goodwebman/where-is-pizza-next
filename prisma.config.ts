/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Migrations need a direct (unpooled) connection: PgBouncer in transaction mode
 * cannot hold the advisory locks `migrate` relies on.
 *
 * DATABASE_URL_UNPOOLED is what Vercel's Neon integration injects, so a
 * deployment works without hand-copying a second variable.
 */
const migrationUrl =
  process.env.DIRECT_DATABASE_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL;

if (!migrationUrl) {
  // Prisma's own message here is just "datasource.url is required", which says
  // nothing about which variable is missing or where it should come from.
  throw new Error(
    'No database URL available for Prisma.\n' +
      'Looked for DIRECT_DATABASE_URL, DATABASE_URL_UNPOOLED, DATABASE_URL.\n\n' +
      'On Vercel: attach a database to the project (Storage → Connect to Project) — ' +
      'the integration injects DATABASE_URL and DATABASE_URL_UNPOOLED itself.\n' +
      'Locally: copy .env.example to .env and fill it in.',
  );
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: migrationUrl,
  },
});

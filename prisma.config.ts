/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Migrations need a direct (unpooled) connection: PgBouncer in transaction
    // mode cannot hold the advisory locks that `migrate` relies on.
    //
    // DATABASE_URL_UNPOOLED is what Vercel's Neon integration injects, so a
    // deployment works without hand-copying a second variable.
    url:
      process.env.DIRECT_DATABASE_URL ??
      process.env.DATABASE_URL_UNPOOLED ??
      process.env.DATABASE_URL!,
  },
});

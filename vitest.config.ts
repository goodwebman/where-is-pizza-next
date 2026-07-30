import path from 'node:path';
import { defineConfig } from 'vitest/config';

const alias = {
  '@': path.resolve(__dirname, '.'),
  // See src/test/stubs/empty.ts — these packages throw outside a React Server
  // Components bundler.
  'server-only': path.resolve(__dirname, 'src/test/stubs/empty.ts'),
  'client-only': path.resolve(__dirname, 'src/test/stubs/empty.ts'),
};

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          globals: true,
          environment: 'node',
          include: [
            'src/server/**/*.test.ts',
            'src/shared/contracts/**/*.test.ts',
          ],
          setupFiles: ['src/test/unit/setup.ts'],
        },
      },
      {
        resolve: { alias },
        test: {
          name: 'integration',
          globals: true,
          environment: 'node',
          include: ['src/app/api/**/*.test.ts'],
          setupFiles: ['src/test/integration/setup.ts'],
          globalSetup: ['src/test/integration/global-setup.ts'],
          // One process, one database: parallel workers would truncate tables
          // out from under each other.
          pool: 'forks',
          poolOptions: { forks: { singleFork: true } },
          testTimeout: 20_000,
          hookTimeout: 60_000,
        },
      },
      {
        resolve: { alias },
        test: {
          name: 'client',
          globals: true,
          environment: 'jsdom',
          include: ['src/{entities,features,widgets,shared}/**/*.test.{ts,tsx}'],
          exclude: ['src/shared/contracts/**'],
          setupFiles: ['src/test/client/setup.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'src/server/db/generated/**',
        'src/test/**',
        '**/*.config.*',
        '**/styles/**',
        '**/*.d.ts',
      ],
    },
  },
});

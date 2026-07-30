import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // CommonJS tooling configs, not part of the app source.
    '.svgrrc.js',
    'svgr-template.js',
    // Prisma client output.
    'src/server/db/generated/**',
  ]),
  {
    // The server layer is reachable from route handlers and Server Components
    // only. Without this, one careless re-export through an entity barrel drags
    // Prisma — and JWT_SECRET — into the browser bundle. `server-only` catches
    // it too, but at build time and with a far worse error.
    files: ['src/entities/**', 'src/features/**', 'src/widgets/**', 'src/shared/**'],
    ignores: ['src/shared/contracts/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/src/server', '@/src/server/*', '**/server/db/*'],
              message:
                'The server layer may only be imported from src/app/** (route handlers and Server Components). Share types through src/shared/contracts instead.',
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;

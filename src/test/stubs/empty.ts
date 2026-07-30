/**
 * Stands in for `server-only` / `client-only` under Vitest.
 *
 * Those packages throw on import unless the bundler resolves the `react-server`
 * condition, which Vitest does not do — without this alias every test that
 * imports a service dies at module load.
 */
export {};

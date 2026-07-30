import { test as setup } from '@playwright/test';

import { registerViaApi } from './helpers';

const STORAGE = 'e2e/.auth/user.json';

/**
 * Registers once and saves the cookie jar, so authenticated specs start signed
 * in instead of repeating the sign-up flow.
 */
setup('authenticate', async ({ request, context }) => {
  await registerViaApi(request);

  await context.storageState({ path: STORAGE });
});

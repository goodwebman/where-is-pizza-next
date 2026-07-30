import { expect, test } from '@playwright/test';

import { password, registerViaApi } from './helpers';

test.describe('protected routes', () => {
  test('bounces an anonymous visitor off the profile', async ({ page }) => {
    await page.goto('/profile/orders');

    // Redirected server-side. The old client-side guard rendered the page and
    // only then redirected from an effect, flashing protected content.
    await expect(page).toHaveURL('/');
  });

  test('never renders profile content to an anonymous visitor', async ({
    request,
  }) => {
    const response = await request.get('/profile/settings', {
      maxRedirects: 0,
    });

    expect([302, 307, 308]).toContain(response.status());
  });

  test('lets a signed-in user through', async ({ page, request }) => {
    const { email } = await registerViaApi(request);

    await page.goto('/');
    const login = await page.request.post('/api/auth/login', {
      data: { email, password },
      headers: { origin: 'http://localhost:3000' },
    });
    expect(login.ok()).toBeTruthy();

    await page.goto('/profile/orders');

    await expect(page).toHaveURL(/\/profile\/orders/);
  });
});

import { expect, test } from '@playwright/test';

import { password, registerViaApi } from './helpers';

test.describe('protected routes', () => {
  // Order history is deliberately open: guests own orders too, keyed by the
  // guest cookie (Order.guestId), and the header links there for everyone.
  test('lets an anonymous visitor open the order history', async ({ page }) => {
    await page.goto('/profile/orders');

    await expect(page).toHaveURL(/\/profile\/orders/);
    await expect(page.getByText('Заказов пока нет')).toBeVisible();
  });

  test('hides the settings tab from an anonymous visitor', async ({ page }) => {
    await page.goto('/profile/orders');

    await expect(
      page.getByRole('button', { name: 'Настройки' }),
    ).toHaveCount(0);
  });

  test('bounces an anonymous visitor off the settings page', async ({
    page,
  }) => {
    await page.goto('/profile/settings');

    // Redirected server-side. A client-side guard would render the page and
    // only then redirect from an effect, flashing protected content.
    await expect(page).toHaveURL('/');
  });

  test('never renders settings content to an anonymous visitor', async ({
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

    await page.goto('/profile/settings');

    await expect(page).toHaveURL(/\/profile\/settings/);
  });
});

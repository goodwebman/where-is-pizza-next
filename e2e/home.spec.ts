import { expect, test } from '@playwright/test';

test.describe('home page', () => {
  test('server-renders the catalogue into the first response', async ({
    request,
  }) => {
    // Regression guard for the prefetch bug: CATEGORIES.map produced an array of
    // arrays, so Promise.all resolved instantly and the dehydrated cache shipped
    // empty — every visitor downloaded the catalogue client-side instead.
    const response = await request.get('/');
    const html = await response.text();

    expect(response.status()).toBe(200);

    for (const title of ['Пепперони Классик', 'Филадельфия', 'Тирамису']) {
      expect(html).toContain(title);
    }
  });

  test('renders in the browser with product images', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Пепперони Классик').first()).toBeVisible();

    const image = page.locator('img[src^="/images/"]').first();
    await expect(image).toBeVisible();
  });

  test('serves product images from the app itself', async ({ request }) => {
    const response = await request.get('/images/pizzas/pizza1.png');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image');
  });

  test('exposes a healthy database', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });
});

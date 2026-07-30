import type { APIRequestContext, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const uniqueEmail = (label: string) =>
  `e2e-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.dev`;

export const password = 'e2e-password-123';

/** Registers through the API so UI tests do not re-test sign-up every time. */
export const registerViaApi = async (
  request: APIRequestContext,
  email = uniqueEmail('user'),
) => {
  const response = await request.post('/api/auth/register', {
    data: { email, username: email.split('@')[0], password },
    headers: { origin: 'http://localhost:3000' },
  });

  expect(response.ok()).toBeTruthy();

  return { email, password };
};

/** Opens the first pizza's modal from the home page. */
export const openFirstPizza = async (page: Page) => {
  const card = page.getByText('Пепперони Классик').first();
  await card.click();
};

export const addFirstPizzaToCart = async (page: Page) => {
  await openFirstPizza(page);

  const modal = page.getByRole('dialog').or(page.locator('body'));
  await modal.getByRole('button', { name: /в корзину|добавить/i }).first().click();
};

export const openCart = async (page: Page) => {
  await page.getByRole('button', { name: /корзина/i }).first().click();
};

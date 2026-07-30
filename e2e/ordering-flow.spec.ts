import { expect, test } from '@playwright/test';

import { password, registerViaApi, uniqueEmail } from './helpers';

const ORIGIN = { origin: 'http://localhost:3000' };

const PIZZA = {
  productId: 'pizza-1',
  selectedOptions: { 'pizza-1:size': ['pizza-1:size:30'] },
};

const HONEST_PRICE = 579; // 499 base + 80 for the 30cm size

const checkout = {
  name: 'Иван',
  phone: '89659862820',
  email: 'ivan@example.com',
  deliveryMode: 'delivery',
  deliveryTime: 'asap',
  paymentMethod: 'cash',
  changeMethod: 'withoutChange',
  address: {
    street: 'Ленина',
    house: '12',
    entrance: '1',
    floor: '3',
    apartment: '45',
    intercom: '45K',
  },
};

/**
 * End-to-end against the built application over HTTP: every request goes through
 * the real route handlers, the real cookies and a real Postgres. Each test gets
 * a fresh browser context, so guest carts never bleed between them.
 */
test.describe('ordering', () => {
  test('a guest can fill a cart and place an order', async ({ request }) => {
    const added = await request.post('/api/cart', {
      data: PIZZA,
      headers: ORIGIN,
    });
    expect(added.ok()).toBeTruthy();

    const cart = await (await request.get('/api/cart')).json();
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].price).toBe(HONEST_PRICE);
    // Options come back human-readable.
    expect(cart.items[0].selectedOptions).toEqual({ Размер: ['30 см'] });

    const order = await request.post('/api/orders', {
      data: checkout,
      headers: ORIGIN,
    });
    expect(order.ok()).toBeTruthy();

    const created = await order.json();
    expect(created.fullPrice).toBe(HONEST_PRICE);
    expect(created.status).toBe('PENDING');

    // The cart is emptied as part of placing the order.
    const afterOrder = await (await request.get('/api/cart')).json();
    expect(afterOrder.items).toHaveLength(0);

    // And the guest can still open their order afterwards.
    const fetched = await request.get(`/api/orders/${created.id}`);
    expect(fetched.status()).toBe(200);
  });

  test('the server prices the cart, whatever the client claims', async ({
    request,
  }) => {
    await request.post('/api/cart', {
      data: { ...PIZZA, price: 1 },
      headers: ORIGIN,
    });

    const cart = await (await request.get('/api/cart')).json();
    expect(cart.items[0].price).toBe(HONEST_PRICE);

    const order = await (
      await request.post('/api/orders', {
        data: { ...checkout, fullPrice: 1 },
        headers: ORIGIN,
      })
    ).json();

    expect(order.fullPrice).toBe(HONEST_PRICE);
  });

  test('one order belongs to one visitor', async ({ request, browser }) => {
    await request.post('/api/cart', { data: PIZZA, headers: ORIGIN });
    const order = await (
      await request.post('/api/orders', { data: checkout, headers: ORIGIN })
    ).json();

    // A different browser context is a different guest.
    const stranger = await browser.newContext({
      baseURL: 'http://localhost:3000',
    });
    const response = await stranger.request.get(`/api/orders/${order.id}`);

    expect(response.status()).toBe(404);
    await stranger.close();
  });

  test('signing up claims the guest cart and past orders', async ({
    request,
  }) => {
    await request.post('/api/cart', {
      data: { ...PIZZA, quantity: 2 },
      headers: ORIGIN,
    });

    const guestOrderResponse = await request.post('/api/orders', {
      data: checkout,
      headers: ORIGIN,
    });
    const guestOrder = await guestOrderResponse.json();

    // Something still in the basket at sign-up time.
    await request.post('/api/cart', { data: PIZZA, headers: ORIGIN });

    const email = uniqueEmail('claim');
    const registered = await request.post('/api/auth/register', {
      data: { email, username: email.split('@')[0], password },
      headers: ORIGIN,
    });
    expect(registered.ok()).toBeTruthy();

    const cart = await (await request.get('/api/cart')).json();
    expect(cart.items).toHaveLength(1);
    expect(cart.userId).toBeTruthy();

    const orders = await (await request.get('/api/orders/me')).json();
    expect(orders.items.map((o: { id: string }) => o.id)).toContain(
      guestOrder.id,
    );
  });

  test('carts merge on login instead of replacing each other', async ({
    request,
    browser,
  }) => {
    const { email } = await registerViaApi(request);

    // Same product and options as the guest will add, so the lines must merge.
    await request.post('/api/cart', {
      data: { ...PIZZA, quantity: 2 },
      headers: ORIGIN,
    });

    const guest = await browser.newContext({
      baseURL: 'http://localhost:3000',
    });
    await guest.request.post('/api/cart', {
      data: { ...PIZZA, quantity: 3 },
      headers: ORIGIN,
    });

    await guest.request.post('/api/auth/login', {
      data: { email, password },
      headers: ORIGIN,
    });

    const merged = await (await guest.request.get('/api/cart')).json();

    expect(merged.items).toHaveLength(1);
    expect(merged.items[0].quantity).toBe(5);

    await guest.close();
  });
});

test.describe('account', () => {
  test('password change invalidates the old password', async ({
    request,
    browser,
  }) => {
    const { email } = await registerViaApi(request);

    const changed = await request.patch('/api/user/password', {
      data: { currentPassword: password, newPassword: 'a-brand-new-password' },
      headers: ORIGIN,
    });
    expect(changed.ok()).toBeTruthy();

    const fresh = await browser.newContext({
      baseURL: 'http://localhost:3000',
    });

    const withOld = await fresh.request.post('/api/auth/login', {
      data: { email, password },
      headers: ORIGIN,
    });
    expect(withOld.status()).toBe(401);

    const withNew = await fresh.request.post('/api/auth/login', {
      data: { email, password: 'a-brand-new-password' },
      headers: ORIGIN,
    });
    expect(withNew.ok()).toBeTruthy();

    await fresh.close();
  });

  test('a session survives a page reload', async ({ page, request }) => {
    const { email } = await registerViaApi(request);

    await page.goto('/');
    await page.request.post('/api/auth/login', {
      data: { email, password },
      headers: ORIGIN,
    });

    await page.reload();

    // httpOnly cookies, so nothing had to be restored from memory.
    const session = await page.request.get('/api/auth/session');
    expect(session.status()).toBe(200);
  });

  test('logout ends the session', async ({ page, request }) => {
    const { email } = await registerViaApi(request);

    await page.goto('/');
    await page.request.post('/api/auth/login', {
      data: { email, password },
      headers: ORIGIN,
    });
    await page.request.post('/api/auth/logout', { headers: ORIGIN });

    expect((await page.request.get('/api/auth/session')).status()).toBe(401);

    await page.goto('/profile/orders');
    await expect(page).toHaveURL('/');
  });
});

test.describe('filters', () => {
  test('narrow the catalogue', async ({ request }) => {
    const all = await (
      await request.post('/api/products', {
        data: { categoryId: 'pizza' },
        headers: ORIGIN,
      })
    ).json();

    const filtered = await (
      await request.post('/api/products', {
        data: { categoryId: 'pizza', filters: { meat: ['Курица'] } },
        headers: ORIGIN,
      })
    ).json();

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.length).toBeLessThan(all.length);
  });

  test('are served for every category', async ({ request }) => {
    const response = await request.get('/api/products/filters/pizza');

    expect(response.status()).toBe(200);
    expect(Object.keys(await response.json())).toContain('meat');
  });
});

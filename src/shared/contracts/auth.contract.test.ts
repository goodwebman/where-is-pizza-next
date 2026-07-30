import { describe, expect, it } from 'vitest';

import { loginSchema, registerSchema } from './auth.contract';

describe('registerSchema', () => {
  it('accepts a valid registration', () => {
    expect(
      registerSchema.parse({
        email: 'user@example.com',
        username: 'Иван',
        password: 'hunter2!',
      }),
    ).toEqual({
      email: 'user@example.com',
      username: 'Иван',
      password: 'hunter2!',
    });
  });

  it('normalises the email so casing cannot create duplicate accounts', () => {
    const parsed = registerSchema.parse({
      email: '  User@Example.COM ',
      username: 'Иван',
      password: 'hunter2!',
    });

    expect(parsed.email).toBe('user@example.com');
  });

  it('trims the username', () => {
    expect(
      registerSchema.parse({
        email: 'user@example.com',
        username: '  Иван  ',
        password: 'hunter2!',
      }).username,
    ).toBe('Иван');
  });

  it('enforces a minimum password length', () => {
    expect(
      registerSchema.safeParse({
        email: 'user@example.com',
        username: 'Иван',
        password: '12345',
      }).success,
    ).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(
      registerSchema.safeParse({
        email: 'nope',
        username: 'Иван',
        password: 'hunter2!',
      }).success,
    ).toBe(false);
  });

  it('rejects a one-character username', () => {
    expect(
      registerSchema.safeParse({
        email: 'user@example.com',
        username: 'И',
        password: 'hunter2!',
      }).success,
    ).toBe(false);
  });
});

describe('loginSchema', () => {
  it('does not impose a length rule on the existing password', () => {
    // Tightening the policy must not lock out accounts created under the old one.
    expect(
      loginSchema.safeParse({ email: 'user@example.com', password: 'old' })
        .success,
    ).toBe(true);
  });

  it('requires a password to be present', () => {
    expect(
      loginSchema.safeParse({ email: 'user@example.com', password: '' })
        .success,
    ).toBe(false);
  });

  it('normalises the email the same way registration does', () => {
    expect(
      loginSchema.parse({ email: 'USER@example.com', password: 'x' }).email,
    ).toBe('user@example.com');
  });
});

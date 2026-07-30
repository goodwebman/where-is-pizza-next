import { describe, expect, it } from 'vitest';

import { changePasswordSchema, updateProfileSchema } from './user.contract';

describe('updateProfileSchema', () => {
  it('accepts a partial update', () => {
    expect(updateProfileSchema.parse({ username: 'Пётр' })).toEqual({
      username: 'Пётр',
    });
  });

  it('rejects an update with nothing in it', () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(false);
  });

  it('validates the phone format', () => {
    expect(updateProfileSchema.safeParse({ phone: '89659862820' }).success).toBe(
      true,
    );
    expect(updateProfileSchema.safeParse({ phone: '12345' }).success).toBe(
      false,
    );
  });

  it('validates the birth date', () => {
    expect(
      updateProfileSchema.safeParse({ birthDate: '1990-05-17' }).success,
    ).toBe(true);
    expect(updateProfileSchema.safeParse({ birthDate: '17.05.1990' }).success).toBe(
      false,
    );
  });
});

describe('changePasswordSchema', () => {
  it('accepts a genuine change', () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: 'old-password',
        newPassword: 'new-password',
      }).success,
    ).toBe(true);
  });

  it('rejects reusing the current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'same-password',
      newPassword: 'same-password',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a new password below the minimum length', () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: 'old-password',
        newPassword: '12345',
      }).success,
    ).toBe(false);
  });

  it('requires the current password', () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: '',
        newPassword: 'new-password',
      }).success,
    ).toBe(false);
  });
});

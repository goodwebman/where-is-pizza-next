import { z } from 'zod';

/**
 * One definition used by both the sign-up form and the API route. The old code
 * validated a 4-character minimum in the form, nothing at all on register, and
 * 6 characters when changing the password — three different rules for the same
 * field. 6 is kept because it was already the strictest rule in the codebase.
 */
export const passwordSchema = z
  .string()
  .min(6, { message: 'Пароль должен быть минимум 6 символов' })
  .max(128, { message: 'Пароль слишком длинный' });

/**
 * Trim and lowercase happen before validation, not after: emails are compared
 * for uniqueness, so " User@Example.com " and "user@example.com" must not be
 * able to become two accounts.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: 'Невалидный Email' }).max(254));

export const usernameSchema = z
  .string()
  .min(2, { message: 'Имя должно быть минимум 2 символа' })
  .max(64, { message: 'Имя слишком длинное' })
  .transform(value => value.trim());

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Введите пароль' }),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

/** Shape returned by GET /api/auth/session and used as the client's user model. */
export type SessionUser = {
  id: number;
  email: string;
  username: string;
};

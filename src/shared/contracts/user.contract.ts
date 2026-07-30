import { z } from 'zod';

import { emailSchema, passwordSchema, usernameSchema } from './auth.contract';

export const updateProfileSchema = z
  .object({
    email: emailSchema.optional(),
    username: usernameSchema.optional(),
    phone: z
      .string()
      .regex(/^[78]\d{10}$/, 'Неверный формат телефона')
      .optional(),
    birthDate: z.iso.date('Неверная дата').optional(),
  })
  .refine(data => Object.values(data).some(value => value !== undefined), {
    message: 'Нечего обновлять',
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Введите текущий пароль'),
    newPassword: passwordSchema,
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    path: ['newPassword'],
    message: 'Новый пароль должен отличаться от текущего',
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

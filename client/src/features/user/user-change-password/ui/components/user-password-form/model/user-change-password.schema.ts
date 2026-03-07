import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(4, 'Введите текущий пароль'),
    newPassword: z
      .string()
      .min(6, 'Новый пароль должен быть минимум 6 символов'),
    confirmPassword: z.string().min(4, 'Повторите новый пароль'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

import { z } from 'zod';

const phoneRegex = /^[78]\d{10}$/;

export const profileSchema = z.object({
  username: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(50, 'Максимум 50 символов')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .regex(
      phoneRegex,
      'Неверный формат телефона. Пример: 89659862820 или 79659862820',
    )
    .optional()
    .or(z.literal('')),

  email: z.string().email('Некорректный email').optional().or(z.literal('')),

  birthDate: z
    .string()

    .optional()
    .or(z.literal('')),
});

export type ProfileSchemaValues = z.infer<typeof profileSchema>;

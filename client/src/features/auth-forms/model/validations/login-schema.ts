import { z } from 'zod';
export const loginSchema = z.object({
  email: z.email().min(3, { message: 'Невалидный Email' }),
  password: z
    .string()
    .min(4, { message: 'Пароль должен быть минимум 4 символа' }),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;

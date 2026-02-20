import { z } from 'zod';
export const registerSchema = z.object({
  email: z.email().min(3, { message: 'Невалидный Email' }),
  password: z
    .string()
    .min(4, { message: 'Пароль должен быть минимум 4 символа' }),
  username: z.string().min(2, { message: 'Имя должно быть минимум 2 символа' }),
});

export type RegisterSchemaValues = z.infer<typeof registerSchema>;

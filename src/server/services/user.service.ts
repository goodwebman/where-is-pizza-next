import 'server-only';

import type { User } from '@/src/entities/user/model/types';
import { hashPassword, verifyPassword } from '@/src/server/auth/password';
import { prisma, type Db } from '@/src/server/db/prisma';
import { badRequest, conflict, notFound } from '@/src/server/http/errors';
import { revokeAllSessions } from '@/src/server/services/auth.service';
import type {
  ChangePasswordInput,
  UpdateProfileInput,
} from '@/src/shared/contracts';

type UserRow = {
  id: number;
  email: string;
  username: string;
  phone: string | null;
  birthDate: Date | null;
};

const profileSelect = {
  id: true,
  email: true,
  username: true,
  phone: true,
  birthDate: true,
} as const;

const toUserDto = (user: UserRow): User => ({
  id: user.id,
  email: user.email,
  username: user.username,
  phone: user.phone,
  // ISO string, not a Date: this DTO is also pushed into the React Query cache
  // from the server, and a refetch would otherwise return a different shape.
  birthDate: user.birthDate ? user.birthDate.toISOString() : null,
});

export const getProfile = async (
  userId: number,
  db: Db = prisma,
): Promise<User> => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });

  if (!user) throw notFound('User not found', 'USER_NOT_FOUND');

  return toUserDto(user);
};

export const updateProfile = async (
  userId: number,
  input: UpdateProfileInput,
  db: Db = prisma,
): Promise<User> => {
  const current = await db.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });

  if (!current) throw notFound('User not found', 'USER_NOT_FOUND');

  // Only check uniqueness for fields that actually changed, otherwise saving an
  // unchanged form would collide with the user's own record.
  const conflicts: { field: keyof UpdateProfileInput; message: string }[] = [];

  if (input.email && input.email !== current.email) {
    conflicts.push({ field: 'email', message: 'Email already in use' });
  }
  if (input.username && input.username !== current.username) {
    conflicts.push({ field: 'username', message: 'Username already taken' });
  }
  if (input.phone && input.phone !== current.phone) {
    conflicts.push({ field: 'phone', message: 'Phone already in use' });
  }

  for (const { field, message } of conflicts) {
    const taken = await db.user.findFirst({
      where: { [field]: input[field], NOT: { id: userId } },
      select: { id: true },
    });

    if (taken) throw conflict(message, `${field.toUpperCase()}_TAKEN`);
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: {
      email: input.email,
      username: input.username,
      phone: input.phone,
      birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
    },
    select: profileSelect,
  });

  return toUserDto(updated);
};

export const changePassword = async (
  userId: number,
  input: ChangePasswordInput,
  db: Db = prisma,
): Promise<void> => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true },
  });

  if (!user) throw notFound('User not found', 'USER_NOT_FOUND');

  if (!(await verifyPassword(input.currentPassword, user.password))) {
    throw badRequest('Current password incorrect', 'WRONG_PASSWORD');
  }

  await db.user.update({
    where: { id: userId },
    data: { password: await hashPassword(input.newPassword) },
  });

  // Everything issued under the old password is now invalid. With a 15-minute
  // access token this genuinely signs other devices out; under the old 15-hour
  // token it was close to symbolic.
  await revokeAllSessions(userId, db);
};

import { cookies } from 'next/headers';
import { cache } from 'react';

export type Session = {
  user: {
    id: number;
    email: string;
    username: string;
  };
  token: string;
};

export const checkSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get('refreshToken');

  if (!refreshToken) return null;

  const res = await fetch('http://localhost:4000/auth/session', {
    method: 'GET',
    headers: {
      Cookie: `refreshToken=${refreshToken.value}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;

  return res.json();
});

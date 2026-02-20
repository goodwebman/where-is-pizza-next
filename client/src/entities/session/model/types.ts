import type { User } from '@/src/entities/user';

export type Session = {
  token: string;
  user: User;
};

export type SessionState =
  | { type: 'idle' }
  | { type: 'pending' }
  | { type: 'authorized'; session: Session }
  | { type: 'failed'; error: string };

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  username: string;
  password: string;
};

export type AuthResponse = Session;
export type RefreshResponse = Session;
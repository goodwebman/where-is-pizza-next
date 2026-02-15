export type User = {
  username: string;
  token: string;
};

export type LoginData = {
  username: string;
  password: string;
};

export type RegisterData = {
  username: string;
  password: string;
};

export type AuthState =
  | { type: 'idle' }
  | { type: 'pending' }
  | { type: 'succeeded'; user: User }
  | { type: 'failed'; error: string };

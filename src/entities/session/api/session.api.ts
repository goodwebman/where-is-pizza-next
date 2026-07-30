import { api } from '@/src/shared/api';
import type {
  LoginInput,
  RegisterInput,
  SessionUser,
} from '@/src/shared/contracts';

type SessionResponse = { user: SessionUser };

/**
 * No tokens cross this boundary any more: the server sets httpOnly cookies and
 * every response carries only the user. What used to be an access token held in
 * Redux memory is now unreachable from JavaScript.
 */
export const sessionApi = {
  getSession: async (): Promise<SessionUser> => {
    const { user } = await api.get<SessionResponse>('/auth/session');
    return user;
  },

  login: async (data: LoginInput): Promise<SessionUser> => {
    const { user } = await api.post<SessionResponse>('/auth/login', data);
    return user;
  },

  register: async (data: RegisterInput): Promise<SessionUser> => {
    const { user } = await api.post<SessionResponse>('/auth/register', data);
    return user;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

import { api } from '@/src/shared/api';
import { UpdateProfileDTO, User } from '../model/types';

export const userApi = {
  getUser: async (): Promise<User> => {
    return await api.get<User>('/user/me');
  },
  updateProfile: async (data: UpdateProfileDTO) => {
    return await api.patch<User>('/user/profile', data);
  },
};

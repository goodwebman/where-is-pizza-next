'use client';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { userApi } from '@/src/entities/user/api/user.api';
import { ChangePasswordDTO } from '@/src/entities/user/model/types';

export const useChangePassword = () => {
  const mutation = useMutation({
    mutationFn: (data: ChangePasswordDTO) =>
      userApi.changePassword(data),

    onSuccess: () => {
      toast.success('Пароль успешно изменён', {
        position: 'top-center',
      });
    },

    onError: () => {
      toast.error('Ошибка смены пароля', {
        position: 'top-center',
      });
    },
  });

  return {
    changePassword: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
  };
};
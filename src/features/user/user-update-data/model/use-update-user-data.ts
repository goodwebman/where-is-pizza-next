'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userApi } from '@/src/entities/user/api/user.api';
import { UpdateProfileDTO } from '@/src/entities/user/model/types';
import { QUERY_KEYS } from '@/src/shared/api';
import toast from 'react-hot-toast';

export const useUpdateUserData = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileDTO) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
      toast.success('Данные пользователя успешно изменены', {
        position: 'top-center',
      });
    },
    onError: () => {
      toast.success('Ошибка обновления данных пользователя', {
        position: 'top-center',
      });
    },
  });

  return {
    updateUserData: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error as string | null,
  };
};

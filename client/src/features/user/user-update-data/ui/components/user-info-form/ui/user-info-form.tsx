'use client';

import { Buttons, InputDefaultField } from '@/src/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdateUserData } from '../../../../model';
import {
  profileSchema,
  ProfileSchemaValues,
} from '../model/user-info-change.schema';
import { getClasses } from './styles/get-classes';

type Props = {
  user: any;
  onCancel: () => void;
};

export const UserInfoForm: FC<Props> = ({ user, onCancel }) => {
  const { updateUserData, loading } = useUpdateUserData();

  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<ProfileSchemaValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
      birthDate: user?.birthDate ?? '',
    },
  });

  const onSubmit = async (data: ProfileSchemaValues) => {
    updateUserData(data);
    onCancel();
  };

  const { cnHeader, cnLabel, cnForm, cnInputs, cnActions } = getClasses({});

  return (
    <>
      <div className={cnHeader}>
        <h1 className={cnLabel}>Изменение личных данных</h1>
      </div>

      <form className={cnForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={cnInputs}>
          <InputDefaultField
            control={control}
            name="username"
            label="Имя"
            placeholder="Введите имя"
          />

          <InputDefaultField
            control={control}
            name="phone"
            label="Телефон"
            type='tel'
            placeholder="+7 999 999 99 99"
          />

          <InputDefaultField
            control={control}
            name="email"
            label="Email"
            placeholder="example@mail.com"
          />

          <InputDefaultField
            control={control}
            name="birthDate"
            label="Дата рождения"
            placeholder="01.01.2000"
            type="date"
          />
        </div>

        <div className={cnActions}>
          <Buttons.DefaultButton type="submit" disabled={!isDirty || loading}>
            {loading ? 'Сохраняем...' : 'Сохранить'}
          </Buttons.DefaultButton>

          <Buttons.TextButton onClick={onCancel}>Отмена</Buttons.TextButton>
        </div>
      </form>
    </>
  );
};

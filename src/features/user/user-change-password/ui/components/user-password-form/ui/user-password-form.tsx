// user-password-form.tsx
'use client';

import { Buttons, InputDefaultField } from '@/src/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { useChangePassword } from '../../../../model';
import { getClasses } from './styles/get-classes';
import { changePasswordSchema, ChangePasswordValues } from '../model/user-change-password.schema'

type Props = {
  onCancel: () => void;
};

export const UserPasswordForm: FC<Props> = ({ onCancel }) => {
  const { changePassword, loading } = useChangePassword();

  const {
    handleSubmit,
    control,
    formState: { isDirty, errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    await changePassword(data);
    onCancel();
  };

  const { cnHeader, cnLabel, cnForm, cnInputs, cnActions } = getClasses({});

  return (
    <>
      <div className={cnHeader}>
        <h1 className={cnLabel}>Изменить пароль</h1>
      </div>

      <form className={cnForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={cnInputs}>
          <InputDefaultField
            control={control}
            name="currentPassword"
            type="password"
            label="Текущий пароль"
            placeholder="Введите текущий пароль"
            errorMessage={errors.currentPassword?.message}
            hasError={!!errors.currentPassword}
          />

          <InputDefaultField
            control={control}
            name="newPassword"
            type="password"
            label="Новый пароль"
            placeholder="Введите новый пароль"
            errorMessage={errors.newPassword?.message}
            hasError={!!errors.newPassword}
          />

          <InputDefaultField
            control={control}
            name="confirmPassword"
            type="password"
            label="Подтверждение пароля"
            placeholder="Повторите новый пароль"
            errorMessage={errors.confirmPassword?.message}
            hasError={!!errors.confirmPassword}
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

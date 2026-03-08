'use client';

import {
  LoginData,
  selectAuthError,
  selectAuthStatus,
  useLogin,
} from '@/src/entities/session';
import { useAppSelector } from '@/src/shared/store/redux-store';
import { Buttons, InputDefaultField } from '@/src/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { loginSchema, LoginSchemaValues } from '../../model';
import { getClasses } from './styles/get-classes';

type LoginFormProps = {
  className?: string;
  onSuccess?: () => void;
};

export const LoginForm: FC<LoginFormProps> = ({ className, onSuccess }) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login } = useLogin();

  const onSubmit = async (data: LoginData) => {
    try {
      await login({
        email: data.email,
        password: data.password,
      });

      toast.success('Вы успешно вошли!', {
        position: 'top-center',
      });

      onSuccess?.();
    } catch  {
      toast.error('Ошибка авторизации', {
        position: 'top-center',
      });
    }
  };

  const { cnRoot, cnTitle, cnSubtitle, cnSuptitle, cnInput, cnForm } =
    getClasses({ className });
  const authError = useAppSelector(selectAuthError);
  const authStatus = useAppSelector(selectAuthStatus);
  return (
    <section className={cnRoot}>
      <h1 className={cnTitle}>Авторизация</h1>
      <p className={cnSubtitle}>
        Сможете быстро оформлять заказы, использовать бонусы
      </p>
      <form className={cnForm} onSubmit={handleSubmit(onSubmit)}>
        <InputDefaultField
          className={cnInput}
          control={control}
          placeholder="email01test@mail.ru"
          name="email"
          label="Введите почту*"
          errorMessage={errors.email?.message || authError}
          hasError={!!errors.email}
        />

        <InputDefaultField
          className={cnInput}
          control={control}
          placeholder="Пароль"
          name="password"
          label="Введите пароль*"
          errorMessage={errors.password?.message || authError}
          hasError={!!errors.password}
        />

        <Buttons.DefaultButton  type='submit'>
          {authStatus === 'pending' ? 'Входим...' : 'Войти'}
        </Buttons.DefaultButton>
      </form>
      <p className={cnSuptitle}>
        Продолжая, вы соглашаетесь со {'\n'} сбором и обработкой персональных
        данных и пользовательским соглашением
      </p>
    </section>
  );
};

LoginForm.displayName = 'LoginFormProps';

'use client';

import { useRegister } from '@/src/entities/session';
import { getErrorMessage } from '@/src/shared/lib/helpers/error/get-error-message';
import { Buttons, InputDefaultField } from '@/src/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { registerSchema, RegisterSchemaValues } from '../../model';
import { getClasses } from './styles/get-classes';

type RegisterFormProps = {
  className?: string;
  onSuccess?: () => void;
};

export const RegisterForm: FC<RegisterFormProps> = ({
  className,
  onSuccess,
}) => {
  const {
    handleSubmit,
    control,
    formState: { touchedFields, errors },
  } = useForm<RegisterSchemaValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const { register, loading } = useRegister();

  const onSubmit = async (data: RegisterSchemaValues) => {
    try {
      await register({
        username: data.username,
        password: data.password,
        email: data.email,
      });
      onSuccess?.();
      toast.success('Вы успешно зарегестрированы!', {
        position: 'top-center',
      });
    } catch (error) {
      // Was `${error}`, which rendered "AxiosError: Request failed with status
      // code 409" into the toast.
      toast.error(getErrorMessage(error), {
        position: 'top-center',
      });
    }
  };

  const { cnRoot, cnTitle, cnSubtitle, cnSuptitle, cnInput, cnForm } =
    getClasses({
      className,
    });

  return (
    <section className={cnRoot}>
      <h1 className={cnTitle}>Регистрация</h1>
      <p className={cnSubtitle}>
        Сможете быстро оформлять заказы, использовать бонусы
      </p>
      <form className={cnForm} onSubmit={handleSubmit(onSubmit)}>
        <InputDefaultField
          className={cnInput}
          control={control}
          placeholder="Иван Иванов"
          name="username"
          label="Введите имя*"
          errorMessage={errors.username?.message}
          hasError={!!errors.username}
        />

        <InputDefaultField
          className={cnInput}
          control={control}
          placeholder="email01test@mail.ru"
          name="email"
          label="Введите почту*"
          errorMessage={errors.email?.message}
          hasError={!!errors.email}
        />

        <InputDefaultField
          className={cnInput}
          control={control}
          placeholder="qwerty128&^*&JAS^D"
          name="password"
          label="Введите пароль*"
          errorMessage={errors.password?.message}
          hasError={!!errors.password}
        />

        <Buttons.DefaultButton type="submit" disabled={loading}>
          {loading ? 'Регистрируем...' : 'Регистрация'}
        </Buttons.DefaultButton>
      </form>
      <p className={cnSuptitle}>
        Продолжая, вы соглашаетесь со сбором и обработкой персональных данных и
        пользовательским соглашением
      </p>
    </section>
  );
};

RegisterForm.displayName = 'RegisterForm';

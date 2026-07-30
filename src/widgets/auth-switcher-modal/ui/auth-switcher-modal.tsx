'use client';
import { LoginForm, RegisterForm } from '@/src/features/auth/auth-forms';
import { Buttons, Modal } from '@/src/shared/ui';
import { FC, useState } from 'react';
import { getClasses } from './styles/get-classes';
import { useLockBodyScroll } from '@/src/shared/hooks'

enum ToggleAuthState {
  LOGIN = 'login',
  REGISTER = 'register',
}

type AuthState = 'login' | 'register';

type AuthSwitcherProps = {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const AuthSwitcherModal: FC<AuthSwitcherProps> = ({
  className,
  isOpen,
  onClose,
}) => {
  const [mode, setMode] = useState<AuthState>(ToggleAuthState.LOGIN);
  const { cnRoot } = getClasses({ className });

   useLockBodyScroll(isOpen);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className={cnRoot}>
        {mode === ToggleAuthState.LOGIN ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSuccess={onClose} />
        )}
        <Buttons.DefaultButton
          onClick={() =>
            setMode(
              mode === ToggleAuthState.LOGIN
                ? ToggleAuthState.REGISTER
                : ToggleAuthState.LOGIN,
            )
          }
        >
          {mode === ToggleAuthState.LOGIN ? 'Нет аккаунта?' : 'Есть аккаунт?'}
        </Buttons.DefaultButton>
      </section>
    </Modal>
  );
};

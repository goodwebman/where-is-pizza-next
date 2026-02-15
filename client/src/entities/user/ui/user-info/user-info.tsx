import { Icons } from '@/src/shared/assets/svg/components';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type UserInfoProps = {
  className?: string;
};

export const UserInfo: FC<UserInfoProps> = ({ className }) => {
  //todo increment auth view

  const { cnRoot, cnText } = getClasses({ className });
  return (
    <button className={cnRoot}>
      <Icons.Account />
      <span className={cnText}>Войти в аккаунт</span>
    </button>
  );
};

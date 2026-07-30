'use client';

import { Icons } from '@/src/shared/assets/svg/components';
import { Buttons } from '@/src/shared/ui';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';
import { formatBirthDate, formatPhone } from '@/src/shared/lib/helpers/formaters'
import { User } from '@/src/entities/user'

type UserInfoViewProps = {
  user: User | null | undefined;
  onEdit: () => void;
};

export const UserInfoView: FC<UserInfoViewProps> = ({ user, onEdit }) => {
  const {
    cnHeader,
    cnLabel,
    cnInfo,
    cnSupLabel,
    cnInfoWrapper,
    cnInfoItem,
  } = getClasses({});

 

  return (
    <>
      <div className={cnHeader}>
        <h1 className={cnLabel}>Личные данные</h1>

        <Buttons.TextButton
          onClick={onEdit}
          icon={<Icons.Pencil />}
          iconPosition="left"
        >
          Изменить
        </Buttons.TextButton>
      </div>

      <div className={cnInfoWrapper}>
        <div className={cnInfoItem}>
          <p className={cnSupLabel}>Имя</p>
          <h2 className={cnInfo}>{user?.username ?? '-'}</h2>
        </div>

        <div className={cnInfoItem}>
          <p className={cnSupLabel}>Номер телефона</p>
          <h2 className={cnInfo}>{formatPhone(user?.phone) ?? '-'}</h2>
        </div>

        <div className={cnInfoItem}>
          <p className={cnSupLabel}>Почта</p>
          <h2 className={cnInfo}>{user?.email ?? '-'}</h2>
        </div>

        <div className={cnInfoItem}>
          <p className={cnSupLabel}>Дата рождения</p>
          <h2 className={cnInfo}>{formatBirthDate(user?.birthDate) ?? '-'}</h2>
        </div>
      </div>
    </>
  );
};
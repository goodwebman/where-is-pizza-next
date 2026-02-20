import { Icons } from '@/src/shared/assets/svg/components';
import { useAppSelector } from '@/src/shared/store/redux-store';
import { DropdownContainer } from '@/src/shared/ui/dropdown/dropdown-container';
import { FC } from 'react';

import { useOptionsSelect } from '../model/use-options-select';
import { getClasses } from './styles/get-classes';
import { selectUser } from '@/src/entities/session/model'

type UserMenuProps = {
  onClick?: () => void;
  className?: string;
};

export const UserMenu: FC<UserMenuProps> = ({ className, onClick }) => {
  const user = useAppSelector(selectUser);
  const { options, handleSelect } = useOptionsSelect();

  const { cnRoot, cnText } = getClasses({ className });
  return (
    <>
      {user ? (
        <DropdownContainer
          placeholder={user.username}
          options={options}
          onSelect={handleSelect}
          forNavigate
        />
      ) : (
        <button onClick={onClick} className={cnRoot}>
          <Icons.Account />

          <span className={cnText}>Войти в аккаунт</span>
        </button>
      )}
    </>
  );
};

UserMenu.displayName = 'UserMenu';

import { Icons } from '@/src/shared/assets/svg/components';
import { DropdownContainer } from '@/src/shared/ui/dropdown/dropdown-container';
import { FC } from 'react';

import { useUserReturnData } from '../../user-return-data';
import { useOptionsSelect } from '../model/use-options-select';
import { getClasses } from './styles/get-classes';

type UserMenuProps = {
  onClick?: () => void;
  className?: string;
};

export const UserMenu: FC<UserMenuProps> = ({ className, onClick }) => {
  const { options, handleSelect } = useOptionsSelect();
  const { data: user, isLoading } = useUserReturnData();
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
      ) : isLoading ? (
        <button  className={cnRoot}>
          <Icons.Account />

          <span className={cnText}>Загрузка...</span>
        </button>
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

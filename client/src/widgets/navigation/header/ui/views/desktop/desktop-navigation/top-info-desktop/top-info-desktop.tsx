'use client';

import { LOCATION_OPTIONS } from '@/src/entities/location/config/location-options';
import { useLocation } from '@/src/entities/location/model/use-location';

import { Icons } from '@/src/shared/assets/svg/components';

import { Dropdown } from '@/src/shared/ui';
import { useAuthSwitcherModal } from '@/src/widgets/auth-switcher-modal';
import { AuthSwitcherModal } from '@/src/widgets/auth-switcher-modal/ui/auth-switcher-modal';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';
import { UserMenu } from '@/src/features/user/user-menu/ui'

type TopInfoProps = {
  className?: string;
};

export const TopInfoDesktop: FC<TopInfoProps> = ({ className }) => {
  const {
    cnRoot,
    cnInfo,
    cnWrapper,
    cnLeftSide,
    cnDropdownWrapper,
    cnDeliveryTime,
    cnCheckAddress,
  } = getClasses({ className });

  const { selected, setSelected } = useLocation();
  const { isOpen, close, open } = useAuthSwitcherModal();

  return (
    <section className={cnRoot}>
      <div className={cnWrapper}>
        <div className={cnLeftSide}>
          <Icons.Location width={20} height={20} />

          <div className={cnDropdownWrapper}>
            <Dropdown.Container
              options={LOCATION_OPTIONS.map(option => ({
                value: option.value,
                children: option.label,
              }))}
              selectedValue={selected}
              onSelect={setSelected}
            />
          </div>
        </div>

        <a className={cnCheckAddress}>Проверить адрес</a>

        <span className={cnInfo}>
          Среднее время доставки*:
          <span className={cnDeliveryTime}> 00:24:19</span>
        </span>
      </div>
      <div className={cnWrapper}>
        <span className={cnInfo}>Время работы: с 11:00 до 23:00</span>

        <UserMenu onClick={open} />
      </div>

      <AuthSwitcherModal isOpen={isOpen} onClose={close} />
    </section>
  );
};

'use client';

import { UserInfo } from '@/src/entities/user/ui';
import { Icons } from '@/src/shared/assets/svg/components';
import { Dropdown } from '@/src/shared/ui/dropdown/dropdown';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';
import { LOCATION_OPTIONS } from '@/src/entities/location/config/location-options'
import { useLocation } from '@/src/entities/location/model/use-location'

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

  return (
    <section className={cnRoot}>
      <div className={cnWrapper}>
        <div className={cnLeftSide}>
          <Icons.Location width={20} height={20} />

          <div className={cnDropdownWrapper}>
            <Dropdown
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

        <UserInfo />
      </div>
    </section>
  );
};

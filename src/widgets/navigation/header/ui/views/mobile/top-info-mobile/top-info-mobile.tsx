'use client';

import { LOCATION_OPTIONS } from '@/src/entities/location/config/location-options';
import { useLocation } from '@/src/entities/location/model/use-location';
import { Icons } from '@/src/shared/assets/svg/components';

import { FC } from 'react';
import { getClasses } from './styles/get-classes';
import { Dropdown } from '@/src/shared/ui'

type TopInfoMobileProps = {
  className?: string;
};

export const TopInfoMobile: FC<TopInfoMobileProps> = ({ className }) => {
  const {
    cnRoot,
    cnInfo,
    cnLeftSide,
    cnDropdownWrapper,
    cnDeliveryTime,
    cnDropdown,
    cnDropdownLabel,
  } = getClasses({ className });

  const { selected, setSelected } = useLocation();
  return (
    <section className={cnRoot}>
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
            className={cnDropdown}
            labelClassName={cnDropdownLabel}
          />
        </div>
      </div>
      <span className={cnInfo}>
        Среднее время доставки*:
        <span className={cnDeliveryTime}> 00:24:19</span>
      </span>
    </section>
  );
};

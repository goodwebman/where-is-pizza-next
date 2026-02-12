'use client';

import { UserInfo } from '@/src/entities/user/ui';
import { Icons } from '@/src/shared/assets/svg/components';
import { Dropdown } from '@/src/shared/ui/dropdown/dropdown';
import { FC, useState } from 'react';
import { getClasses } from './styles/get-classes';

type TopInfoProps = {
  className?: string;
};

export const TopInfo: FC<TopInfoProps> = ({ className }) => {
  const { cnRoot, cnInfo, cnWrapper, cnLeftSide, cnDropdownWrapper } =
    getClasses({ className });

  const [selectedFruit, setSelectedFruit] = useState('Moscow');

  const fruitOptions = [
    { value: 'Moscow', children: 'Москва' },
    { value: 'Omsk', children: 'Омск' },
    { value: 'Kirow', children: 'Киров' },
    { value: 'Volgograd', children: 'Волгоград' },
  ];

  const handleFruitSelect = (value: string) => {
    setSelectedFruit(value);
  };
  return (
    <nav className={cnRoot}>
      <div className={cnWrapper}>
        <div className={cnLeftSide}>
          <Icons.Location width={20} height={20} />

          <div className={cnDropdownWrapper}>
            <Dropdown
              placeholder="123"
              options={fruitOptions}
              onSelect={handleFruitSelect}
              selectedValue={selectedFruit}
            />
          </div>
        </div>

        <a className={cnInfo}>Проверить адрес</a>

        <span className={cnInfo}>Среднее время доставки*:</span>
      </div>
      <div className={cnWrapper}>
        <span className={cnInfo}>Время работы: с 11:00 до 23:00</span>

        <UserInfo />
      </div>
    </nav>
  );
};

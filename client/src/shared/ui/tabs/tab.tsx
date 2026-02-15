import { FC } from 'react';
import { getClasses } from './styles/get-classes';
import { TabValue } from './types'



type TabProps = {
  label: string;
  value: TabValue;
  isActive: boolean;
  disabled?: boolean;
  onClick: (value: TabValue) => void;
};

export const Tab: FC<TabProps> = ({
  label,
  value,
  isActive,
  disabled,
  onClick,
}) => {
  const { cnTab } = getClasses({});

  return (
    <button
      className={cnTab({
        active: isActive,
        disabled,
      })}
      onClick={() => !disabled && onClick(value)}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

Tab.displayName = 'Tab';

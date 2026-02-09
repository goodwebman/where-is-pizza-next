import { Dispatch, FC, SetStateAction } from 'react';
import { getClasses } from './styles/get-classes';

type Tab = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string | number;
  onChange: Dispatch<SetStateAction<string | number>>;
  className?: string;
};

export const Tabs: FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  const { cnRoot, cnTab } = getClasses({ className });

  return (
    <div className={cnRoot}>
      {tabs.map(tab => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            className={cnTab({
              active: isActive,
              disabled: tab.disabled,
            })}
            onClick={() => !tab.disabled && onChange(tab.value)}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

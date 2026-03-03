import { Tab } from './tab';
import { TabsContainer } from './tabs-container';

type TabItem<T extends string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

type TabsProps<T extends string> = {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (value: T) => void;
  className?: string;
};

export const TabsRoot = <T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>) => {
  return (
    <TabsContainer className={className}>
      {tabs.map(tab => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          disabled={tab.disabled}
          isActive={tab.value === activeTab}
          onClick={onChange}
        />
      ))}
    </TabsContainer>
  );
};

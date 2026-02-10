import { Dispatch, FC, SetStateAction } from 'react';
import { Tab } from './tab';
import { TabsContainer } from './tabs-container';
import { TabItem, TabValue } from './types';

type TabsProps = {
  tabs: TabItem[];
  activeTab: TabValue;
  onChange: Dispatch<SetStateAction<TabValue>>;
  className?: string;
};

export const TabsRoot: FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
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

TabsRoot.displayName = 'Tabs';


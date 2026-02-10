import { FC, ReactNode } from 'react';
import { getClasses } from './styles/get-classes';

type TabsContainerProps = {
  children: ReactNode;
  className?: string;
};

export const TabsContainer: FC<TabsContainerProps> = ({
  children,
  className,
}) => {
  const { cnRoot } = getClasses({ className });

  return <div className={cnRoot}>{children}</div>;
};

TabsContainer.displayName = 'TabsContainer';

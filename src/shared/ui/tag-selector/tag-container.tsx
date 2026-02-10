import { FC, ReactNode } from 'react';
import { getTagContainerClasses } from './styles/get-classse';

type TagContainerProps = {
  children: ReactNode;
  className?: string;
};

export const TagContainer: FC<TagContainerProps> = ({
  children,
  className,
}) => {
  const { cnContainer } = getTagContainerClasses(className);

  return <div className={cnContainer}>{children}</div>;
};

import { FC, ReactNode } from 'react';
import { getCheckboxContainerClasses } from './styles/get-classes';

type CheckboxContainerProps = {
  children: ReactNode;
  className?: string;
};

export const CheckboxContainer: FC<CheckboxContainerProps> = ({
  children,
  className,
}) => {
  const { cnContainer } = getCheckboxContainerClasses(className);

  return <div className={cnContainer}>{children}</div>;
};

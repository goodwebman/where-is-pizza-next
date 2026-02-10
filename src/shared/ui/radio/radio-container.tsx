import { FC, ReactNode } from 'react';
import { getRadioContainerClasses } from './styles/get-classes';

type RadioContainerProps = {
  children: ReactNode;
  className?: string;
};

export const RadioContainer: FC<RadioContainerProps> = ({
  children,
  className,
}) => {
  const { cnContainer } = getRadioContainerClasses(className);

  return <div className={cnContainer}>{children}</div>;
};

RadioContainer.displayName = 'RadioContainer'

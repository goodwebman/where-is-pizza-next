import { FC, ReactNode } from 'react';
import { getClasses } from './styles/get-classes';

type FooterContainerProps = {
  children: ReactNode;
  className?: string;
};

export const FooterContainer: FC<FooterContainerProps> = ({
  children,
  className,
}) => {
  const { cnRoot } = getClasses({ className });
  return <footer className={cnRoot}>{children}</footer>;
};

FooterContainer.displayName = 'FooterContainer'

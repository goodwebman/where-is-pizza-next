import { FC, ReactElement } from 'react';
import { getClasses } from './styles/get-classes';

type HeaderContainerProps = {
  className?: string;
  topSlot?: ReactElement;
  bottomSlot?: ReactElement;
};

export const HeaderContainer: FC<HeaderContainerProps> = ({
  className,
  topSlot,
  bottomSlot,
}) => {
  const { cnHeader, cnDivider } = getClasses({ className });
  return (
    <header className={cnHeader}>
      <section >{topSlot}</section>
      <div className={cnDivider}/>
      <section > {bottomSlot}</section>
       <div className={cnDivider}/>
    </header>
  );
};

HeaderContainer.displayName = 'HeaderContainer';

import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { getDropdownItemClasses } from './styles/get-classes';

export type DropdownItemProps = {
  children: ReactNode;
  value: string;
  isActive?: boolean;
  className?: string;
  onItemClick: (value: string, href?: string) => void;
  href?: string;
};

export const DropdownItem: FC<DropdownItemProps> = ({
  children,
  value,
  onItemClick,
  isActive,
  className,
  href,
}) => {
  const { cnItem } = getDropdownItemClasses({ isActive, className });

  const handleClick = () => {
    onItemClick(value, href);
  };

  const renderContent = href ? (
    <li role="menuitem">
      <Link className={cnItem} onClick={handleClick} href={href} passHref>
        {children}
      </Link>
    </li>
  ) : (
    <li role="menuitem" className={cnItem} onClick={handleClick}>
      {children}
    </li>
  );

  return renderContent;
};

DropdownItem.displayName = 'DropdownItem';

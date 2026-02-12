'use client';

import { useHandleScroll } from '@/src/shared/hooks/ui/use-handle-scroll';
import Link from 'next/link';
import { RefObject } from 'react';
import { getItemClasses } from './styles/get-classes';

type NavigationItemProps = {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
  scrollRef?: RefObject<HTMLElement>;
  scrollToId?: string;
  offset?: number;
};

export function NavigationItem({
  children,
  href,
  active,
  className,
  onClick,
  scrollRef,
  scrollToId,
  offset,
}: NavigationItemProps) {
  const { cnItem, cnLink } = getItemClasses({ className, active });

  const handleScroll = useHandleScroll({
    scrollRef,
    scrollToId,
    offset,
    onClick,
  });

  const renderContent = () => {
    if (scrollRef || scrollToId) {
      return (
        <button type="button" className={cnLink} onClick={handleScroll}>
          {children}
        </button>
      );
    }

    if (href) {
      return (
        <Link href={href} className={cnLink} onClick={onClick}>
          {children}
        </Link>
      );
    }

    return (
      <button type="button" className={cnLink} onClick={onClick}>
        {children}
      </button>
    );
  };

  return <li className={cnItem}>{renderContent()}</li>;
}

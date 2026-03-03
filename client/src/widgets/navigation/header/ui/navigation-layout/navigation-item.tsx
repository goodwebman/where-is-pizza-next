'use client';

import { useHandleScroll } from '@/src/shared/hooks/ui/use-handle-scroll';
import { usePathname, useRouter } from 'next/navigation';
import { RefObject, useCallback } from 'react';
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
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = useHandleScroll({
    scrollRef,
    scrollToId,
    offset,
    onClick,
  });

  const handleClick = useCallback(() => {
    if (href && scrollToId) {
      if (pathname !== href) {
        router.push(`${href}#${scrollToId}`);
      } else {
        handleScroll();
      }
    } else if (href) {
      router.push(href);
      onClick?.();
    } else {
      handleScroll();
    }
  }, [href, scrollToId, pathname, router, handleScroll, onClick]);

  const renderContent = () => {
    return (
      <button type="button" className={cnLink} onClick={handleClick}>
        {children}
      </button>
    );
  };

  return <li className={cnItem}>{renderContent()}</li>;
}

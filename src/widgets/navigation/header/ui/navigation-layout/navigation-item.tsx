'use client';

import { useHandleScroll } from '@/src/shared/hooks/ui/use-handle-scroll';
import Link from 'next/link';
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

  const handleAnchorClick = useCallback(() => {
    if (!href) {
      handleScroll();
      return;
    }

    if (pathname !== href) {
      router.push(`${href}#${scrollToId}`);
    } else {
      handleScroll();
    }
  }, [href, scrollToId, pathname, router, handleScroll]);

  const renderContent = () => {
    /**
     * A plain destination is a real <Link>: as a <button> + router.push it was
     * dead to middle-click, ctrl+click and "open in new tab", got no prefetch,
     * and told assistive tech it was a button rather than a link.
     */
    if (href && !scrollToId) {
      return (
        <Link href={href} className={cnLink} onClick={onClick}>
          {children}
        </Link>
      );
    }

    // Anchor scrolling stays a button — it moves the viewport, it does not
    // navigate.
    return (
      <button type="button" className={cnLink} onClick={handleAnchorClick}>
        {children}
      </button>
    );
  };

  return <li className={cnItem}>{renderContent()}</li>;
}

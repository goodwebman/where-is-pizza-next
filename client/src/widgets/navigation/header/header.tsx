'use client';

import { useMediaQuery } from '@/src/shared/hooks/media/use-media-query';

import { CartBadge } from '@/src/entities/cart/ui';
import { ROUTES } from '@/src/shared/config/routes/routes';
import { Logo } from '@/src/shared/ui/logo';

import { CATEGORIES_NAV_ITEMS } from '@/src/shared/config/categories/categories';
import { useLockBodyScroll } from '@/src/shared/hooks';
import { getCategorySectionId } from '@/src/shared/lib';
import { useMobileMenu } from './model';
import {
  BurgerButton,
  HeaderContainer,
  MobileNavigation,
  Navigation,
  TopInfoDesktop,
  TopInfoMobile,
} from './ui';

const TABLET_BREAKPOINT = 768;

export const Header = () => {
  const isTabletOrMobile = useMediaQuery(
    `(max-width: ${TABLET_BREAKPOINT - 0.02}px)`,
  );

  const { isOpen, toggleMenu } = useMobileMenu();

  useLockBodyScroll(isOpen);

  return (
    <HeaderContainer
      topSlot={isTabletOrMobile ? <TopInfoMobile /> : <TopInfoDesktop />}
      bottomSlot={
        <Navigation.Container
          leftSlot={<Logo href={ROUTES.HOME} />}
          rightSlot={
            isTabletOrMobile ? (
              <BurgerButton open={isOpen} onClick={toggleMenu} />
            ) : (
              <CartBadge />
            )
          }
        >
          {!isTabletOrMobile &&
            CATEGORIES_NAV_ITEMS.map(item => (
              <Navigation.Item
                key={item.anchor}
                href={ROUTES.HOME}
                scrollToId={getCategorySectionId(item.anchor)}
                offset={80}
              >
                {item.label}
              </Navigation.Item>
            ))}

          

          {isTabletOrMobile && (
            <MobileNavigation isOpen={isOpen} onClose={toggleMenu} />
          )}
        </Navigation.Container>
      }
    />
  );
};

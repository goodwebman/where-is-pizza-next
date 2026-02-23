'use client';

import { useMediaQuery } from '@/src/shared/hooks/media/use-media-query';

import { CartBadge } from '@/src/entities/cart/ui';
import { ROUTES } from '@/src/shared/config/routes/routes';
import { Logo } from '@/src/shared/ui/logo';


import {
  BurgerButton,
  HeaderContainer,
  MobileNavigation,
  Navigation,
  TopInfoDesktop,
  TopInfoMobile,
} from './ui';
import { useMobileMenu } from './model'
import { CATEGORIES_NAV_ITEMS } from '@/src/shared/config/categories/categories'
import { getCategorySectionId } from '@/src/shared/lib'

const TABLET_BREAKPOINT = 768;

export const Header = () => {
  const isTabletOrMobile = useMediaQuery(
    `(max-width: ${TABLET_BREAKPOINT - 0.02}px)`,
  );

  const { isOpen, toggleMenu } = useMobileMenu();

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
               scrollToId={getCategorySectionId(item.anchor)}
              >
                {item.label}
              </Navigation.Item>
            ))}

          <MobileNavigation
            isOpen={isOpen && isTabletOrMobile}
            onClose={toggleMenu}
          />
        </Navigation.Container>
      }
    />
  );
};

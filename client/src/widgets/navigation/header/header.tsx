'use client';

import { useMediaQuery } from '@/src/shared/hooks/media/use-media-query';

import { CartBadge } from '@/src/entities/cart/ui';
import { ROUTES } from '@/src/shared/config/routes/routes';
import { Logo } from '@/src/shared/ui/logo';

import { NAV_ITEMS, useMobileMenu } from './model';
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
            NAV_ITEMS.map(item => (
              <Navigation.Item key={item.anchor} scrollToId={item.anchor}>
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

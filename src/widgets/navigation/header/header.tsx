'use client';

import { useMediaQuery } from '@/src/shared/hooks/media/use-media-query';
import { Navigation } from './ui/desktop/desktop-navigation/main-navigation';
import { TopInfo } from './ui/desktop/desktop-navigation/top-info/top-info';
import { HeaderLogo } from './ui/desktop/header-logo/header-logo';
import { NAV_ITEMS } from './model'

const TABLET_BREAKPOINT = 768;

export const Header = () => {
  const isTabletOrMobile = useMediaQuery(
    `(max-width: ${TABLET_BREAKPOINT - 0.02}px)`,
  );
  return (
    <nav>
      <TopInfo />
      <Navigation.Container
        leftSlot={<HeaderLogo />}
        rightSlot={<p>Корзина</p>}
      >
        {NAV_ITEMS.map(item => (
          <Navigation.Item key={item.anchor} scrollToId={item.anchor}>
            {item.label}
          </Navigation.Item>
        ))}
      </Navigation.Container>
    </nav>
  );
};

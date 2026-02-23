'use client';

import { CartBadge } from '@/src/entities/cart/ui';

import { UserMenu } from '@/src/features/user/user-menu/ui';
import { Icons } from '@/src/shared/assets/svg/components';
import { Divider, SocialInfo } from '@/src/shared/ui';
import {
  AuthSwitcherModal,
  useAuthSwitcherModal,
} from '@/src/widgets/auth-switcher-modal';

import { CATEGORIES_NAV_ITEMS } from '@/src/shared/config/categories/categories';
import { Navigation } from '../../desktop';
import { getClasses } from './styles/get-classes';
import { getCategorySectionId } from '@/src/shared/lib'

interface MobileNavigationProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  className,
  isOpen,
  onClose,
}) => {
  const {
    cnRoot,
    cnItem,
    cnUserCartWrapper,
    cnWrapper,
    cnContactsWrapper,
    cnContactsSocials,
    cnTimeWork,
    cnContent,
  } = getClasses({
    className,
  });

  if (!isOpen) return null;

  const {
    isOpen: isAuthSwitcherModalOpen,
    open,
    close,
  } = useAuthSwitcherModal();

  return (
    <nav className={cnRoot}>
      <div className={cnContent}>
        <div className={cnUserCartWrapper}>
          <UserMenu onClick={open} />
          <CartBadge />
        </div>
        <Divider />
        <ul className={cnWrapper}>
          {CATEGORIES_NAV_ITEMS.map(item => (
            <Navigation.Item
              key={item.anchor}
             scrollToId={getCategorySectionId(item.anchor)}
              onClick={onClose}
              className={cnItem}
            >
              {item.label}
            </Navigation.Item>
          ))}
        </ul>
        <Divider />
        <section className={cnContactsWrapper}>
          <SocialInfo
            text="+7 (234) 567-89-00"
            type="phone"
            iconLeft={<Icons.Phone width={20} height={20} />}
          />
          <SocialInfo
            text="Москва, ул. Юных Ленинцев, д.99"
            iconLeft={<Icons.LocationSmall width={20} height={20} />}
          />
          <div className={cnContactsSocials}>
            <SocialInfo
              text="Facebook"
              type="external"
              href="https://facebook.com/yourpage"
              iconLeft={<Icons.Facebook width={20} height={20} />}
            />
            <SocialInfo
              text="Instagram"
              type="external"
              href="https://"
              iconLeft={<Icons.Instagram width={20} height={20} />}
            />
          </div>
        </section>
      </div>
      <div className={cnTimeWork}>
        <Divider />
        <p>Время работы: с 11:00 до 23:00</p>
        <Divider />
      </div>

      <AuthSwitcherModal isOpen={isAuthSwitcherModalOpen} onClose={close} />
    </nav>
  );
};

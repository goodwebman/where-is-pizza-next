'use client';
import { Icons } from '@/src/shared/assets/svg/components';
import { ROUTES } from '@/src/shared/config/routes/routes';
import { useMediaQuery } from '@/src/shared/hooks';
import { Divider, Logo, SocialInfo } from '@/src/shared/ui';
import { FC } from 'react';
import { FooterLayout } from './ui';

const TABLET_BREAKPOINT = 768;

export const Footer: FC = () => {
  const isTabletOrMobile = useMediaQuery(
    `(max-width: ${TABLET_BREAKPOINT - 0.02}px)`,
  );
  return (
    <FooterLayout.Container>
      <Logo href={ROUTES.HOME} />
      <FooterLayout.Section label="Куда пицца">
        <FooterLayout.Item href='12'>О компании</FooterLayout.Item>

        <FooterLayout.Item>Пользовательское соглашение</FooterLayout.Item>

        <FooterLayout.Item>Условия гарантии</FooterLayout.Item>
      </FooterLayout.Section>

      <FooterLayout.Section label="Помощь">
        <FooterLayout.Item>Ресторан</FooterLayout.Item>

        <FooterLayout.Item>Контакты</FooterLayout.Item>

        <FooterLayout.Item>Поддержка</FooterLayout.Item>
        <FooterLayout.Item>Отследить заказ</FooterLayout.Item>
      </FooterLayout.Section>

      <FooterLayout.Section label="Контакты">
        <SocialInfo
          text="+7 (234) 567-89-00"
          type="phone"
          iconLeft={<Icons.Phone width={20} height={20} />}
        />
        <SocialInfo
          text="Москва, ул. Юных Ленинцев, д.99"
          iconLeft={<Icons.LocationSmall width={20} height={20} />}
        />

        <FooterLayout.Section flexVariant="row">
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
        </FooterLayout.Section>
      </FooterLayout.Section>
      {isTabletOrMobile && <Divider />}
    </FooterLayout.Container>
  );
};

Footer.displayName = 'Footer';

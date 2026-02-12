import { Icons } from '@/src/shared/assets/svg/components';
import Link from 'next/link';
import { FC } from 'react';
import { ROUTES } from './../../../../../../shared/config/routes/routes';
import { getClasses } from './styles/get-classes';

type HeaderLogoProps = {
  className?: string;
};

export const HeaderLogo: FC<HeaderLogoProps> = ({ className }) => {
  const { cnRoot, cnText } = getClasses({ className });
  return (
    <Link className={cnRoot} href={ROUTES.HOME}>
      <Icons.Logo width={32} height={32} />
      <span className={cnText}>Куда пицца</span>
    </Link>
  );
};

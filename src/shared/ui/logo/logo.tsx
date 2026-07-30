import { Icons } from '@/src/shared/assets/svg/components';
import Link from 'next/link';
import { FC } from 'react';
import { getClasses } from './styles/get-classes';

type LogoProps = {
  className?: string;
  href: string;
};

export const Logo: FC<LogoProps> = ({ className, href }) => {
  const { cnRoot, cnText } = getClasses({ className });
  return (
    <Link className={cnRoot} href={href}>
      <Icons.Logo width={32} height={32} />
      <span className={cnText}>Куда пицца</span>
    </Link>
  );
};

Logo.displayName = 'Logo'
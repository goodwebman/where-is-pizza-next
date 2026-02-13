import { FC, ReactNode, useMemo } from 'react';
import { getSocialInfoClasses } from './styles/get-classes';

type SocialInfoType = 'external' | 'phone' | 'email' | 'custom' | 'text';

type SocialInfoProps = {
  text: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  type?: SocialInfoType;
  href?: string;
  className?: string;
};

export const SocialInfo: FC<SocialInfoProps> = ({
  text,
  iconLeft,
  iconRight,
  type = 'text',
  href,
  className,
}) => {
  const { cnRoot, cnIcon, cnText } = getSocialInfoClasses({ className });

  const computedHref = useMemo(() => {
    switch (type) {
      case 'external':
      case 'custom':
        return href;
      case 'phone':
        return `tel:${text.replace(/\s+/g, '')}`;
      case 'email':
        return `mailto:${text}`;
      default:
        return undefined;
    }
  }, [type, text, href]);

  const content = (
    <>
      {iconLeft && <span className={cnIcon}>{iconLeft}</span>}
      <span className={cnText}>{text}</span>
      {iconRight && <span className={cnIcon}>{iconRight}</span>}
    </>
  );

  if (!computedHref) {
    return <div className={cnRoot}>{content}</div>;
  }

  const isExternal = type === 'external';

  return (
    <a
      href={computedHref}
      className={cnRoot}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  );
};

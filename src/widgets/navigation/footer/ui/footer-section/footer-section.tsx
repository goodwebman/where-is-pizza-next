import { FC, ReactNode } from 'react';
import { getClasses } from './styles/get-classes';

type FooterSectionProps = {
  className?: string;
  children: ReactNode;
  label?: string;
  flexVariant?: 'column' | 'row';
};

export const FooterSection: FC<FooterSectionProps> = ({
  children,
  className,
  label,
  flexVariant = 'column',
}) => {
  const { cnRoot, cnLabel, cnSlotsContainer } = getClasses({
    className,
    variant: flexVariant,
  });

  return (
    <section className={cnRoot}>
      {label && <p className={cnLabel}>{label}</p>}
      <div className={cnSlotsContainer}>{children}</div>
    </section>
  );
};

FooterSection.displayName = 'FooterSection';

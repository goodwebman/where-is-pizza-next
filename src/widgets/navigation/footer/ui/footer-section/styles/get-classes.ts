import classNames from 'classnames/bind';
import classes from './footer-section.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  labelClassName?: string;
  slotsContainerClassName?: string;
  variant?: 'column' | 'row';
};

export const getClasses = ({
  className,
  labelClassName,
  slotsContainerClassName,
  variant = 'column',
}: Args) => {
  const cnRoot = cn('root', variant, className);
  const cnLabel = cn('label', labelClassName);
  const cnSlotsContainer = cn('slots-container', variant, slotsContainerClassName);

  return {
    cnRoot,
    cnLabel,
    cnSlotsContainer,
  };
};

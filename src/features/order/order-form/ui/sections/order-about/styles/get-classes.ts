import classNames from 'classnames/bind';
import classes from './order-about.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnAbout = cn('about', className);
  const cnAboutLabel = cn('about--label');
  const cnAboutInputs = cn('about--inputs');

  return {
    cnAbout,
    cnAboutLabel,
    cnAboutInputs,
  };
};

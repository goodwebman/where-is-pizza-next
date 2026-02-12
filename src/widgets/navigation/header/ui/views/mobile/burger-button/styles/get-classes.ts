import classNames from 'classnames/bind';
import classes from './burger-button.module.scss';

const cn = classNames.bind(classes);

type Args = {
  open: boolean;
  className?: string;
};

export const getClasses = ({ open, className }: Args) => {
  const cnBurger = cn(
    'burger',
    {
      open,
    },
    className,
  );

  return {
    cnBurger,
  };
};

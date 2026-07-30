import classNames from 'classnames/bind';
import classes from './modal.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnRoot = cn('root');
  const cnOverlay = cn('overlay');
  const cnContent = cn('content', className);
  const cnCloseBtn = cn('close-btn');


  return {
    cnRoot,
    cnOverlay,
    cnContent,
    cnCloseBtn,

  };
};

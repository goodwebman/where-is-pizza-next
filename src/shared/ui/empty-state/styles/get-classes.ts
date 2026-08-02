import classNames from 'classnames/bind';
import classes from './empty-state.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  compact?: boolean;
};

export const getClasses = ({ className, compact }: Args) => {
  const cnRoot = cn('root', { compact }, className);
  const cnMedia = cn('media', { compact });
  const cnTitle = cn('title', { compact });
  const cnDescription = cn('description');
  const cnAction = cn('action');

  return {
    cnRoot,
    cnMedia,
    cnTitle,
    cnDescription,
    cnAction,
  };
};

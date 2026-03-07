import classNames from 'classnames/bind';
import classes from './user-info-form.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnRoot = cn('root', className);
  const cnHeader = cn('header');
  const cnLabel = cn('label');

  const cnForm = cn('form');
  const cnInputs = cn('inputs');
  const cnActions = cn('actions');

  return {
    cnRoot,
    cnHeader,
    cnLabel,
    cnForm,
    cnInputs,
    cnActions,
  };
};
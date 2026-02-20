import classNames from 'classnames/bind';
import classes from './register-form.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnRoot = cn('root', className);
  const cnTitle = cn('title');
  const cnSubtitle = cn('subtitle');
  const cnSuptitle = cn('suptitle');
  const cnInput = cn('input');
  const cnForm = cn('form')
  return { cnRoot, cnTitle, cnSubtitle, cnSuptitle, cnInput, cnForm };
};

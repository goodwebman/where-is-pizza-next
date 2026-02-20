import classNames from 'classnames/bind';
import classes from './auth-switcher-modal.module.scss';

const cn = classNames.bind(classes);

type Props = {
    className?: string
}

export const getClasses = ({className}: Props) => {
  const cnRoot = cn('root', className);
  return { cnRoot };
};
import classNames from 'classnames/bind';
import classes from './user-profile-sections-tabs.module.scss';

const cn = classNames.bind(classes);

export const getClasses = () => ({
  cnRoot: cn('root'),
  cnLabel: cn('label'),
});

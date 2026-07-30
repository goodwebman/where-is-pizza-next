import classNames from 'classnames/bind';

import classes from './user-password-change.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnRoot = cn('root', className);
  const cnHeader = cn('header');
  const cnLabel = cn('label')
  const cnSupLabel = cn('label--sup')
  const cnInfo = cn('info')
  const cnInfoWrapper = cn('info--wrapper')
  const cnInfoItem = cn('info--item')

  return {
    cnRoot,
    cnHeader,
    cnLabel,
    cnSupLabel,
    cnInfo,
    cnInfoWrapper,
    cnInfoItem
  };
};

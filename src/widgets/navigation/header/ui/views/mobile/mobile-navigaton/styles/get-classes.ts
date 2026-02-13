import classNames from 'classnames/bind';
import classes from './mobile-navigation.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args = {}) => {
  const cnRoot = cn('root', className);
  const cnContent = cn('content');
  const cnItem = cn('item');
  const cnWrapper = cn('wrapper');
  const cnUserCartWrapper = cn('user-cart-wrapper');
  const cnContactsWrapper = cn('contacts-wrapper');
  const cnContactsSocials = cn('contacts-socials');
  const cnTimeWork = cn('time-work');

  return {
    cnRoot,
    cnContent,
    cnItem,
    cnUserCartWrapper,
    cnWrapper,
    cnContactsWrapper,
    cnContactsSocials,
    cnTimeWork
  };
};

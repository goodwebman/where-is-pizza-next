import { WithClassNames } from '@/src/shared/types';
import classNames from 'classnames/bind';
import classes from './product-card-empty.module.scss';

const cn = classNames.bind(classes);

export const getProductCardEmptyClasses = ({ className }: WithClassNames) => {
  const cnCard = cn('card', className);
  const cnText = cn('text');
  const cnImageWrapper = cn('imageWrapper');
  const cnImage = cn('image');
  const cnContent = cn('content');
  return {
    cnCard,
    cnText,
    cnImageWrapper,
    cnImage,
    cnContent,
  };
};

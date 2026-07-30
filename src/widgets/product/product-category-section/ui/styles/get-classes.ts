import classNames from 'classnames/bind';
import classes from './product-category-section.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
};

export const getClasses = ({ className }: Args) => {
  const cnSection = cn('section', className);
  const cnHeader = cn('header');
  const cnHeaderLabel = cn('header--label');
  const cnFilterButton = cn('filter-button');
  const cnProductsContainer = cn('products-container');
  return {
    cnHeader,
    cnHeaderLabel,
    cnFilterButton,
    cnProductsContainer,
    cnSection,
  };
};

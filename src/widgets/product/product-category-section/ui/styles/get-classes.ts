import classNames from 'classnames/bind';
import classes from './product-category-section.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  hasSelectedFilters?: boolean;
};

export const getClasses = ({ className, hasSelectedFilters }: Args) => {
  const cnSection = cn('section', className);
  const cnHeader = cn('header');
  const cnHeaderLabel = cn('header--label');
  const cnFilterButton = cn('filter-button', {
    'filter-button--active': hasSelectedFilters,
  });
  const cnFilterCount = cn('filter-count');
  const cnProductsContainer = cn('products-container');
  return {
    cnHeader,
    cnHeaderLabel,
    cnFilterButton,
    cnFilterCount,
    cnProductsContainer,
    cnSection,
  };
};

import { WithClassNames } from '@/src/shared/types';
import classNames from 'classnames/bind';
import classes from './product-filters-drawer.module.scss';

const cn = classNames.bind(classes);

export const getProductFiltersDrawerClasses = ({ className }: WithClassNames) => {
  const cnDrawerContent = cn('drawerContent', className);
  const cnFilterGroup = cn('filterGroup');
  const cnGroupLabel = cn('groupLabel');
  const cnGroupOptions = cn('groupOptions');
  const cnDrawerFooter = cn('drawerFooter');
  const cnResetBtn = cn('resetBtn');
  const cnApplyBtn = cn('applyBtn');

  return {
    cnDrawerContent,
    cnFilterGroup,
    cnGroupLabel,
    cnGroupOptions,
    cnDrawerFooter,
    cnResetBtn,
    cnApplyBtn,
  };
};
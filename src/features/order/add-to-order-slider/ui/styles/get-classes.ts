import classNames from 'classnames/bind'
import classes from './add-to-order-slider.module.scss'

const cn = classNames.bind(classes);

export const getClasses = () => ({
  cnRoot: cn('root'),
  cnViewport: cn('viewport'),
  cnCard: cn('card'),
  cnLabel: cn('label'),
  cnNavNext: cn('nav--next'),
  cnNavPrev: cn('nav--prev'),
});

import classNames from 'classnames/bind';
import classes from './order-card.module.scss';

const cn = classNames.bind(classes);

type Args = {
  className?: string;
  expanded?: boolean; 
};

export const getClasses = ({ className, expanded }: Args) => ({
  cnContainer: cn('container', className),
  cnHeader: cn('header'),
  cnLeft: cn('left'),
  cnStatusBar: cn('statusBar'),
  cnOrderInfo: cn('orderInfo'),
  cnOrderNumber: cn('orderNumber'),
  cnDate: cn('date'),
  cnPrice: cn('price'),
  cnStatus: cn('status'),
  cnFooter: cn('footer'),
  cnItems: cn('items'),
  cnItemIcon: cn('itemIcon'),
  cnExpandBtn: cn('expandBtn', { expanded }), 
  cnDetails: cn('details'),
  cnSection: cn('section'),

  cnProductRow: cn('productRow'),
  cnProductImage: cn('productImage'),
  cnProductInfo: cn('productInfo'),
  cnOptionsText: cn('optionsText'),
});
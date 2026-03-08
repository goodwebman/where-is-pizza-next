import classNames from 'classnames/bind'
import classes from './order-card.module.scss'

const cn = classNames.bind(classes)

type Args = {
  className?: string
}

export const getClasses = ({ className }: Args) => {
  const cnContainer = cn('container', className)
  const cnHeader = cn('header')
  const cnLeft = cn('left')
  const cnStatusBar = cn('statusBar')
  const cnOrderInfo = cn('orderInfo')
  const cnOrderNumber = cn('orderNumber')
  const cnDate = cn('date')
  const cnPrice = cn('price')
  const cnStatus = cn('status')
  const cnFooter = cn('footer')
  const cnItems = cn('items')
  const cnItemIcon = cn('itemIcon')

  return {
    cnContainer,
    cnHeader,
    cnLeft,
    cnStatusBar,
    cnOrderInfo,
    cnOrderNumber,
    cnDate,
    cnPrice,
    cnStatus,
    cnFooter,
    cnItems,
    cnItemIcon,
  }
}
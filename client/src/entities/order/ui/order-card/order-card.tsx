import { FC } from 'react'
import { Order } from '../../model/types'
import { WithClassNames } from '@/src/shared/types'
import { getClasses } from './styles/get-classes'
import { orderStatusMap } from '../../model/status'

type OrderCardProps = {
  order: Order
}

export const OrderCard: FC<WithClassNames<OrderCardProps>> = ({ order, className }) => {
  const {
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
  } = getClasses({ className })

  const status = orderStatusMap[order.status]

  return (
    <div className={cnContainer}>
      <div className={cnHeader}>

        <div className={cnLeft}>

          <div
            className={cnStatusBar}
            style={{ background: status.color }}
          />

          <div className={cnOrderInfo}>
            <div className={cnOrderNumber}>
              Заказ №{order.id.slice(0, 6)}
            </div>

            <div className={cnDate}>
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>

        </div>

        <div className={cnPrice}>
          <div>Сумма заказа</div>
          <strong>{order.fullPrice} ₽</strong>
        </div>

        <div
          className={cnStatus}
          style={{ color: status.color }}
        >
          {status.label}
        </div>

      </div>

      <div className={cnFooter}>

        <div>
          {order.deliveryMode === 'delivery'
            ? 'Доставка'
            : 'Самовывоз'}
        </div>

        <div className={cnItems}>
          {order.items.slice(0, 3).map(item => (
            <div key={item.id} className={cnItemIcon} />
          ))}
        </div>

      </div>
    </div>
  )
}

OrderCard.displayName = 'OrderCard'
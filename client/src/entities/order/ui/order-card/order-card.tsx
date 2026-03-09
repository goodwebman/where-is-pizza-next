import { Icons } from '@/src/shared/assets/svg/components';
import { getOptionsText } from '@/src/shared/lib/helpers/formaters';
import { WithClassNames } from '@/src/shared/types';
import { FC, useState } from 'react';
import { orderStatusMap } from '../../model/status';
import { Order } from '../../model/types';
import { getClasses } from './styles/get-classes';

type OrderCardProps = {
  order: Order;
};

export const OrderCard: FC<WithClassNames<OrderCardProps>> = ({
  order,
  className,
}) => {
  const [expanded, setExpanded] = useState(false);
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
    cnExpandBtn,
    cnDetails,
    cnSection,
    cnOptionsText,
    cnProductImage,
    cnProductInfo,
    cnProductRow,
  } = getClasses({ className, expanded });

  const status = orderStatusMap[order.status];

  return (
    <div className={cnContainer}>
      <div className={cnHeader}>
        <div className={cnLeft}>
          <div className={cnStatusBar} style={{ background: status.color }} />
          <div className={cnOrderInfo}>
            <div className={cnOrderNumber}>Заказ №{order.id.slice(0, 6)}</div>
            <div className={cnDate}>
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className={cnPrice}>
          <div>Сумма заказа</div>
          <strong>{order.fullPrice} ₽</strong>
        </div>

        <div className={cnStatus}>
          <div>Cтатус</div>
          <p style={{ color: status.color }}> {status.label}</p>
        </div>

        <button
          className={cnExpandBtn}
          onClick={() => setExpanded(prev => !prev)}
        >
          <Icons.ArrowDown width={15} height={15} color="var(--icon-primary)" />
        </button>
      </div>

      <div className={cnFooter}>
        <div>
          {order.deliveryMode === 'delivery' ? 'Доставка' : 'Самовывоз'}
        </div>

        <div className={cnItems}>
          {order.items.slice(0, 3).map(item => (
            <div key={item.id} className={cnItemIcon}>
              <img src={item.imageSrc} alt={item.title} />
            </div>
          ))}
        </div>
      </div>

      {expanded && (
        <div className={cnDetails}>
      
          <div className={cnSection}>
            <strong>Товары</strong>
            {order.items.map(item => (
              <div key={item.id} className={cnProductRow}>
                <div className={cnProductImage}>
                  <img src={item.imageSrc} alt={item.title} />
                </div>
                <div className={cnProductInfo}>
                  {item.title} × {item.quantity} — {item.price} ₽
                  {item.selectedOptions && (
                    <div className={cnOptionsText}>
                      Опции: {getOptionsText(item.selectedOptions)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Клиент */}
          <div className={cnSection}>
            <strong>Клиент</strong>
            <div>{order.name}</div>
            <div>{order.phone}</div>
            <div>{order.email}</div>
          </div>

          {/* Доставка */}
          <div className={cnSection}>
            <strong>Доставка</strong>
            <div>
              {order.deliveryMode === 'delivery' ? 'Доставка' : 'Самовывоз'}
            </div>
            {order.address && (
              <div>
                {order.address.street} {order.address.house}
                {order.address.apartment && `, кв ${order.address.apartment}`}
                {order.address.floor && `, этаж ${order.address.floor}`}
              </div>
            )}
            {order.scheduledDate && (
              <div>
                {order.scheduledDate} {order.scheduledTime}
              </div>
            )}
          </div>

          {/* Оплата */}
          <div className={cnSection}>
            <strong>Оплата</strong>
            <div>{order.paymentMethod}</div>
            {order.changeMethod === 'withChange' && (
              <div>Сдача с {order.changeFrom} ₽</div>
            )}
          </div>

          {/* Комментарий */}
          {order.comment && (
            <div className={cnSection}>
              <strong>Комментарий</strong>
              <div>{order.comment}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

OrderCard.displayName = 'OrderCard';

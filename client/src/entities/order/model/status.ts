import { OrderStatus } from './types'

export const orderStatusMap: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  PENDING: {
    label: 'Обрабатывается',
    color: '#FF6B00',
  },
  CONFIRMED: {
    label: 'Выполнен',
    color: '#2ECC71',
  },
  CANCELLED: {
    label: 'Отмена',
    color: '#9E9E9E',
  },
}
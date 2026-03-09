import { Address } from '@/src/entities/order/model/types'

export const formatAddress = (address?: Address | null) => {
  if (!address) return ''

  return [
    address.street,
    address.house,
    address.apartment && `кв ${address.apartment}`,
    address.floor && `этаж ${address.floor}`,
    address.entrance && `подъезд ${address.entrance}`,
  ]
    .filter(Boolean)
    .join(', ')
}
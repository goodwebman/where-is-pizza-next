export type OrderItem = {
  productId: string
  quantity: number
}

export type OrderDraft = {
  items: OrderItem[]
  address: string
  comment?: string
}

export type Order = OrderDraft & {
  id: string
  createdAt: string
  status: 'pending' | 'paid' | 'delivered'
}
import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { clearCart, COOKIE_NAME } from './cart-controller'

export enum DeliveryMode {
  Delivery = 'delivery',
  Pickup = 'pickup',
}

export enum DeliveryTime {
  ASAP = 'asap',
  Scheduled = 'scheduled',
}

export enum PaymentMethod {
  Cash = 'cash',
  Card = 'card',
  ApplePay = 'applePay',
}

export enum ChangeMethod {
  WithoutChange = 'withoutChange',
  WithChange = 'withChange',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

// Prisma enum mappings
const deliveryModeMap = {
  [DeliveryMode.Delivery]: 'Delivery',
  [DeliveryMode.Pickup]: 'Pickup',
} as const

const deliveryTimeMap = {
  [DeliveryTime.ASAP]: 'ASAP',
  [DeliveryTime.Scheduled]: 'Scheduled',
} as const

const paymentMethodMap = {
  [PaymentMethod.Cash]: 'Cash',
  [PaymentMethod.Card]: 'Card',
  [PaymentMethod.ApplePay]: 'Card',
} as const

const changeMethodMap = {
  [ChangeMethod.WithoutChange]: 'WithoutChange',
  [ChangeMethod.WithChange]: 'WithChange',
} as const

/** CREATE ORDER (userId или guestId) */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || null
    const guestId = req.cookies?.[COOKIE_NAME] || null

    const cartId =
      guestId ||
      (userId && (await prisma.cart.findUnique({ where: { userId } }))?.id)

    if (!cartId) return res.status(400).json({ error: 'Cart not found' })

    const cart = await prisma.cart.findFirst({
      where: { OR: [{ guestId: cartId }, { id: cartId }] },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ error: 'Cart is empty' })

    const fullPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0)

    const {
      name,
      phone,
      email,
      deliveryMode,
      deliveryTime,
      address,
      scheduledDate,
      scheduledTime,
      restaurantId,
      paymentMethod,
      changeMethod,
      changeFrom,
      comment,
    } = req.body

    const deliveryModeSafe = deliveryModeMap[deliveryMode as DeliveryMode]
    const deliveryTimeSafe = deliveryTimeMap[deliveryTime as DeliveryTime]
    const paymentMethodSafe = paymentMethodMap[paymentMethod as PaymentMethod]
    const changeMethodSafe = changeMethodMap[changeMethod as ChangeMethod]

    const order = await prisma.order.create({
      data: {
        userId,
        cartId: cart.id,
        fullPrice,
        status: 'PENDING',
        name,
        phone,
        email,
        deliveryMode: deliveryModeSafe,
        deliveryTime: deliveryTimeSafe,
        paymentMethod: paymentMethodSafe,
        changeMethod: changeMethodSafe,
        street: address?.street ?? null,
        house: address?.house ?? null,
        entrance: address?.entrance ?? null,
        floor: address?.floor ?? null,
        apartment: address?.apartment ?? null,
        intercom: address?.intercom ?? null,
        scheduledDate: scheduledDate ?? null,
        scheduledTime: scheduledTime ?? null,
        restaurantId: restaurantId ?? null,
        changeFrom: changeFrom ?? null,
        comment: comment ?? null,
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            title: item.product.title,
            quantity: item.quantity,
            price: item.price,
            selectedOptions: item.selectedOptions,
          })),
        },
      },
      include: { items: true },
    })

    await clearCart(cart.id)

    res.json(order)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

/** GET ORDER BY ID (userId или guestId) */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params
    const userId = req.user?.id
    const guestId = req.cookies?.[COOKIE_NAME]

    // Формируем массив условий для OR
    const orConditions: any[] = []
    if (userId) orConditions.push({ userId })
    if (guestId) orConditions.push({ cart: { guestId } })

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        ...(orConditions.length > 0 ? { OR: orConditions } : {}),
      },
      include: { items: true },
    })

    if (!order) return res.status(404).json({ error: 'Order not found' })

    res.json(order)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

/** GET ORDERS (мои заказы или гостя) */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const guestId = req.cookies?.[COOKIE_NAME]

    if (!userId && !guestId) return res.status(401).json({ error: 'Unauthorized' })

    const orConditions: any[] = []
    if (userId) orConditions.push({ userId })
    if (guestId) orConditions.push({ cart: { guestId } })

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 5
    const skip = (page - 1) * limit

    const total = await prisma.order.count({
      where: { ...(orConditions.length > 0 ? { OR: orConditions } : {}) },
    })

    const orders = await prisma.order.findMany({
      where: { ...(orConditions.length > 0 ? { OR: orConditions } : {}) },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    res.json({
      total,
      items: orders,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}
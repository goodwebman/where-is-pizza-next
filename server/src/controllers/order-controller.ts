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

/** Преобразование selectedOptions id -> titles */
function transformOptions(rawOptions: string, product: any) {
  const parsed = rawOptions ? JSON.parse(rawOptions) : {}

  const readable: Record<string, string[]> = {}

  for (const option of product.options ?? []) {
    const selectedIds = (parsed as Record<string, any>)[option.id]
    if (!selectedIds?.length) continue

    const titles = option.values
      .filter((v: any) => selectedIds.includes(v.id))
      .map((v: any) => v.title)

    if (titles.length) {
      readable[option.title] = titles
    }
  }

  return readable
}

/** CREATE ORDER */
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
      include: {
        items: {
          include: {
            product: {
              include: {
                options: {
                  include: { values: true },
                },
              },
            },
          },
        },
      },
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
          create: cart.items.map(item => {
            const readableOptions = transformOptions(
              item.selectedOptions,
              item.product
            )

            return {
              productId: item.productId,
              title: item.product.title,
              quantity: item.quantity,
              price: item.price,
              selectedOptions: JSON.stringify(readableOptions),
              ingredients: JSON.stringify(item.product.ingredients),
               imageSrc: item.product.imageSrc,
            }
          }),
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

/** GET ORDER BY ID */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params
    const userId = req.user?.id
    const guestId = req.cookies?.[COOKIE_NAME]

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

    const items = order.items.map(item => {
      let selectedOptions: Record<string, string[]> = {}
      try {
        const parsed =
          typeof item.selectedOptions === 'string'
            ? JSON.parse(item.selectedOptions)
            : item.selectedOptions

        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          for (const key of Object.keys(parsed)) {
            const val = (parsed as Record<string, any>)[key]
            if (Array.isArray(val)) selectedOptions[key] = val
            else if (typeof val === 'string') selectedOptions[key] = [val]
          }
        }
      } catch {
        selectedOptions = {}
      }

      return {
        ...item,
        selectedOptions,
        imageSrc: item.imageSrc
      }
    })

    // Собираем объект address
    const address = {
      street: order.street ?? undefined,
      house: order.house ?? undefined,
      entrance: order.entrance ?? undefined,
      floor: order.floor ?? undefined,
      apartment: order.apartment ?? undefined,
      intercom: order.intercom ?? undefined,
    }

    res.json({
      ...order,
      address,
      items,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

/** GET MY ORDERS */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const guestId = req.cookies?.[COOKIE_NAME]

    if (!userId && !guestId)
      return res.status(401).json({ error: 'Unauthorized' })

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

    const normalizedOrders = orders.map(order => {
      const items = order.items.map(item => {
        let selectedOptions: Record<string, string[]> = {}

        try {
          const parsed =
            typeof item.selectedOptions === 'string'
              ? JSON.parse(item.selectedOptions)
              : item.selectedOptions

          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            for (const key of Object.keys(parsed)) {
              const val = (parsed as Record<string, any>)[key]
              if (Array.isArray(val)) selectedOptions[key] = val
              else if (typeof val === 'string') selectedOptions[key] = [val]
            }
          }
        } catch {
          selectedOptions = {}
        }

        return {
          ...item,
          selectedOptions,
          imageSrc: item.imageSrc,
        }
      })

      // Собираем объект address для каждого заказа
      const address = {
        street: order.street ?? undefined,
        house: order.house ?? undefined,
        entrance: order.entrance ?? undefined,
        floor: order.floor ?? undefined,
        apartment: order.apartment ?? undefined,
        intercom: order.intercom ?? undefined,
      }

      return {
        ...order,
        address,
        items,
      }
    })

    res.json({
      total,
      items: normalizedOrders,
      page,
      limit,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}
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

const deliveryModeMap: Record<DeliveryMode, 'Delivery' | 'Pickup'> = {
	[DeliveryMode.Delivery]: 'Delivery',
	[DeliveryMode.Pickup]: 'Pickup',
}

const deliveryTimeMap: Record<DeliveryTime, 'ASAP' | 'Scheduled'> = {
	[DeliveryTime.ASAP]: 'ASAP',
	[DeliveryTime.Scheduled]: 'Scheduled',
}

const paymentMethodMap: Record<PaymentMethod, 'Cash' | 'Card'> = {
	[PaymentMethod.Cash]: 'Cash',
	[PaymentMethod.Card]: 'Card',
	[PaymentMethod.ApplePay]: 'Card', // если Prisma не поддерживает ApplePay
}

const changeMethodMap: Record<ChangeMethod, 'WithoutChange' | 'WithChange'> = {
	[ChangeMethod.WithoutChange]: 'WithoutChange',
	[ChangeMethod.WithChange]: 'WithChange',
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || null

    const cartId =
      req.cookies?.[COOKIE_NAME] ||
      (userId && (await prisma.cart.findUnique({ where: { userId } }))?.id)

    if (!cartId) {
      return res.status(400).json({ error: 'Cart not found' })
    }

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' })
    }

    const fullPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    )

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

    const order = await prisma.order.create({
      data: {
        userId,
        cartId,
        fullPrice,
        status: 'PENDING',

        name,
        phone,
        email,

        // Prisma enum принимает строку Delivery / Pickup
        deliveryMode: deliveryModeMap[deliveryMode as DeliveryMode],
        deliveryTime: deliveryTimeMap[deliveryTime as DeliveryTime],
        paymentMethod: paymentMethodMap[paymentMethod as PaymentMethod],
        changeMethod: changeMethodMap[changeMethod as ChangeMethod],

        // 🔥 ВОТ ТУТ БЫЛА ПРОБЛЕМА
        street: address?.street || null,
        house: address?.house || null,
        entrance: address?.entrance || null,
        floor: address?.floor || null,
        apartment: address?.apartment || null,
        intercom: address?.intercom || null,

        scheduledDate: scheduledDate || null,
        scheduledTime: scheduledTime || null,
        restaurantId: restaurantId || null,

        changeFrom: changeFrom || null,
        comment: comment || null,

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

    await clearCart(cartId)

    res.json(order)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.params
		const userId = req.user?.id

		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
				...(userId ? { userId } : {}), // если залогинен, привязываем к нему
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

export const getMyOrders = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id
		if (!userId) return res.status(401).json({ error: 'Unauthorized' })

		const orders = await prisma.order.findMany({
			where: { userId },
			include: { items: true },
			orderBy: { createdAt: 'desc' },
		})

		res.json(orders)
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Server error' })
	}
}

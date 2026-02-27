// src/entities/cart/controller/cart-controller.ts
import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

export const COOKIE_NAME = 'cartId'

/** --- HELPERS --- **/

export const getOrCreateCart = async (cartId?: string, userId?: number) => {
	if (userId) {
		// у пользователя всегда одна корзина
		let userCart = await prisma.cart.findUnique({ where: { userId } })
		if (userCart) return userCart

		return prisma.cart.create({ data: { userId } })
	}

	if (cartId) {
		const cart = await prisma.cart.findUnique({ where: { id: cartId } })
		if (cart) return cart
	}

	// гостевая корзина
	return prisma.cart.create({ data: {} })
}

export const serializeOptions = (opts?: Record<string, string[]>) =>
	JSON.stringify(opts ?? {})

export const deserializeOptions = (str?: string) => (str ? JSON.parse(str) : {})

/** --- CART ITEMS --- **/

export const addItemToCart = async (
	cartId: string,
	productId: string,
	quantity: number,
	selectedOptions: Record<string, string[]>,
	price: number,
) => {
	const serialized = JSON.stringify(selectedOptions)

	const existing = await prisma.cartItem.findFirst({
		where: { cartId, productId, selectedOptions: serialized },
	})

	if (existing) {
		return prisma.cartItem.update({
			where: { id: existing.id },
			data: { quantity: existing.quantity + quantity },
		})
	}

	return prisma.cartItem.create({
		data: { cartId, productId, quantity, selectedOptions: serialized, price },
	})
}

export const removeItemFromCart = async (
	cartId: string,
	cartItemId: string,
) => {
	const item = await prisma.cartItem.findFirst({
		where: { id: cartItemId, cartId },
	})
	if (!item) throw new Error('Item not found in this cart')

	return prisma.cartItem.delete({ where: { id: cartItemId } })
}

/** --- GET CART WITH ITEMS --- **/

export const getCartWithItems = async (cartId: string) => {
	return prisma.cart.findUnique({
		where: { id: cartId },
		include: {
			items: {
				include: {
					product: {
						include: {
							nutrition: true,
							options: { include: { values: true } },
						},
					},
				},
			},
		},
	})
}

/** --- MERGE GUEST CART --- **/

export const mergeGuestCart = async (guestCartId: string, userId: number) => {
	const guestCart = await prisma.cart.findUnique({
		where: { id: guestCartId },
		include: { items: true },
	})
	if (!guestCart) return

	let userCart = await prisma.cart.findUnique({ where: { userId } })
	if (!userCart) {
		// присваиваем гостевую корзину пользователю
		await prisma.cart.update({ where: { id: guestCart.id }, data: { userId } })
		return
	}

	for (const item of guestCart.items) {
		const exists = await prisma.cartItem.findFirst({
			where: {
				cartId: userCart.id,
				productId: item.productId,
				selectedOptions: item.selectedOptions,
			},
		})

		if (exists) {
			await prisma.cartItem.update({
				where: { id: exists.id },
				data: { quantity: exists.quantity + item.quantity },
			})
		} else {
			await prisma.cartItem.create({
				data: {
					cartId: userCart.id,
					productId: item.productId,
					quantity: item.quantity,
					selectedOptions: item.selectedOptions,
					price: item.price,
				},
			})
		}
	}

	// удаляем гостевую корзину
	await prisma.cart.delete({ where: { id: guestCart.id } })
}

/** --- EXPRESS ENDPOINTS --- **/

// Add item
export const addToCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id
		const cartIdFromCookie = req.cookies?.[COOKIE_NAME]

		const cart = await getOrCreateCart(cartIdFromCookie, userId)

		if (!cartIdFromCookie && !userId) {
			res.cookie(COOKIE_NAME, cart.id, {
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 1000 * 60 * 60 * 24 * 30,
			})
		}

		const { productId, quantity = 1, selectedOptions = {}, price } = req.body

		if (typeof price !== 'number') {
			return res.status(400).json({ error: 'Price is required' })
		}

		const item = await addItemToCart(
			cart.id,
			productId,
			quantity,
			selectedOptions,
			price, // <-- передаём цену
		)

		res.json(item)
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Server error' })
	}
}

// Get cart
export const getCart = async (req: Request, res: Response) => {
	try {
		const cartId =
			req.cookies?.[COOKIE_NAME] ||
			(req.user?.id &&
				(
					await prisma.cart.findUnique({
						where: { userId: req.user.id },
					})
				)?.id)

		if (!cartId) return res.json(null)

		const cart = await getCartWithItems(cartId)
		if (!cart) return res.json(null)

		const transformed = {
			...cart,
			items: cart.items.map(item => {
				const parsedOptions = item.selectedOptions
					? JSON.parse(item.selectedOptions)
					: {}

				const readable: Record<string, string[]> = {}

				for (const option of item.product.options ?? []) {
					const selectedIds = parsedOptions[option.id]
					if (!selectedIds?.length) continue

					const titles = option.values
						.filter(v => selectedIds.includes(v.id))
						.map(v => v.title)

					if (titles.length) {
						readable[option.title] = titles
					}
				}

				return {
					...item,
					selectedOptions: readable,
					price: item.price,
				}
			}),
		}

		res.json(transformed)
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Server error' })
	}
}

// Remove item
export const deleteFromCart = async (req: Request, res: Response) => {
	try {
		const cartId = req.cookies?.[COOKIE_NAME]
		if (!cartId) return res.status(400).json({ error: 'No cart' })

		const { itemId } = req.params

		await removeItemFromCart(cartId, itemId)

		res.json({ success: true, itemId })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Server error' })
	}
}

export const updateCartItemQuantity = async (
  cartId: string,
  cartItemId: string,
  quantity: number,
) => {
  const item = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cartId },
  })

  if (!item) throw new Error('Item not found in this cart')

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  })
}

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const cartId = req.cookies?.[COOKIE_NAME]
    if (!cartId) return res.status(400).json({ error: 'No cart' })

    const { itemId } = req.params
    const { quantity } = req.body

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' })
    }

    const updated = await updateCartItemQuantity(cartId, itemId, quantity)

    res.json(updated)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}
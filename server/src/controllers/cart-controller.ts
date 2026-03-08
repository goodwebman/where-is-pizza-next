import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../../lib/prisma'

export const COOKIE_NAME = 'cartId'

/** --- HELPERS --- **/

export const getOrCreateCart = async (cartId?: string, userId?: number) => {
	if (userId) {
		let userCart = await prisma.cart.findUnique({ where: { userId } })
		if (userCart) return userCart

		// Если есть гостевая корзина с cartId, "присвоить" её пользователю
		if (cartId) {
			const guestCart = await prisma.cart.findUnique({
				where: { guestId: cartId },
			})
			if (guestCart) {
				return prisma.cart.update({
					where: { id: guestCart.id },
					data: { userId },
				})
			}
		}

		return prisma.cart.create({ data: { userId } })
	}

	// Гостевая корзина
	if (cartId) {
		const cart = await prisma.cart.findUnique({ where: { guestId: cartId } })
		if (cart) return cart
	}

	const newGuestId = cartId || uuidv4()
	return prisma.cart.create({ data: { guestId: newGuestId } })
}

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

/** --- GET CART WITH ITEMS --- **/

export const getCartWithItems = async (cartId: string) => {
	return prisma.cart.findFirst({
		where: { OR: [{ guestId: cartId }, { id: cartId }] },
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

/** --- EXPRESS ENDPOINTS --- **/

// Add item
export const addToCart = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id
		const cartIdFromCookie = req.cookies?.[COOKIE_NAME]

		const cart = await getOrCreateCart(cartIdFromCookie, userId)

		if (!cartIdFromCookie && !userId && cart.guestId) {
			res.cookie(COOKIE_NAME, cart.guestId, {
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 1000 * 60 * 60 * 24 * 30, // 30 дней
			})
		}

		const { productId, quantity = 1, selectedOptions = {}, price } = req.body
		if (typeof price !== 'number')
			return res.status(400).json({ error: 'Price is required' })

		const item = await addItemToCart(
			cart.id,
			productId,
			quantity,
			selectedOptions,
			price,
		)

		res.json(item)
	} catch (e) {
		console.error('Add to cart error:', e)
		res.status(500).json({
			error: 'Server error add to cart',
			detail: e instanceof Error ? e.message : e,
		})
	}
}

// Get cart
export const getCart = async (req: Request, res: Response) => {
	try {
		const cartId =
			req.cookies?.[COOKIE_NAME] ||
			(req.user?.id &&
				(await prisma.cart.findUnique({ where: { userId: req.user.id } }))?.id)

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
					if (titles.length) readable[option.title] = titles
				}

				return { ...item, selectedOptions: readable, price: item.price }
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
		const userId = req.user?.id

		if (!cartId && !userId) return res.status(400).json({ error: 'No cart' })

		const { itemId } = req.params

		// Находим корзину
		const cart = await prisma.cart.findFirst({
			where: {
				OR: [
					cartId ? { guestId: cartId } : undefined,
					userId ? { userId } : undefined,
				].filter((x): x is { guestId: string } | { userId: number } => !!x),
			},
		})

		if (!cart) return res.status(404).json({ error: 'Cart not found' })

		await prisma.cartItem.deleteMany({
			where: { id: itemId, cartId: cart.id },
		})

		res.json({ success: true, itemId })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Server error' })
	}
}

// Clear cart
export const clearCart = async (cartId: string) => {
	await prisma.cartItem.deleteMany({ where: { cartId } })
}

export const updateCartItem = async (req: Request, res: Response) => {
	try {
		const cartId = req.cookies?.[COOKIE_NAME]
		const userId = req.user?.id

		if (!cartId && !userId) return res.status(400).json({ error: 'No cart' })

		const { itemId } = req.params
		const { quantity } = req.body
		if (typeof quantity !== 'number' || quantity < 1)
			return res.status(400).json({ error: 'Invalid quantity' })

		// Ищем корзину (гостевую или пользователя)
		const cart = await prisma.cart.findFirst({
			where: {
				OR: [
					cartId ? { guestId: cartId } : undefined,
					userId ? { userId } : undefined,
				].filter((x): x is { guestId: string } | { userId: number } => !!x),
			},
		})

		if (!cart) return res.status(404).json({ error: 'Cart not found' })

		const item = await prisma.cartItem.update({
			where: { id: itemId },
			data: { quantity },
		})

		res.json(item)
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Server error' })
	}
}

// DELETE /cart/clear
export const clearCartController = async (req: Request, res: Response) => {
	try {
		const cartId = req.cookies?.[COOKIE_NAME]
		if (!cartId) return res.status(400).json({ error: 'No cart' })

		await clearCart(cartId)
		res.json({ success: true })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Server error' })
	}
}

export const mergeGuestCart = async (guestId: string, userId: number) => {
	const guestCart = await prisma.cart.findUnique({
		where: { guestId },
		include: { items: true },
	})

	if (!guestCart) return

	let userCart = await prisma.cart.findUnique({
		where: { userId },
		include: { items: true },
	})

	/**
	 * Если у пользователя нет корзины
	 * просто присваиваем guest cart
	 */
	if (!userCart) {
		await prisma.cart.update({
			where: { id: guestCart.id },
			data: {
				userId,
				guestId: null,
			},
		})

		return
	}

	/**
	 * MERGE ITEMS
	 */
	for (const guestItem of guestCart.items) {
		const existingItem = userCart.items.find(
			item =>
				item.productId === guestItem.productId &&
				item.selectedOptions === guestItem.selectedOptions,
		)

		if (existingItem) {
			await prisma.cartItem.update({
				where: { id: existingItem.id },
				data: {
					quantity: existingItem.quantity + guestItem.quantity,
				},
			})
		} else {
			await prisma.cartItem.create({
				data: {
					cartId: userCart.id,
					productId: guestItem.productId,
					quantity: guestItem.quantity,
					selectedOptions: guestItem.selectedOptions,
					price: guestItem.price,
				},
			})
		}
	}

	/**
	 * удалить guest items
	 */
	await prisma.cartItem.deleteMany({
		where: { cartId: guestCart.id },
	})

	/**
	 * удалить guest cart
	 */
	await prisma.cart.delete({
		where: { id: guestCart.id },
	})
}

import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'

export const getProducts = async (req: Request, res: Response) => {
	try {
		const { categoryId, filters } = req.body as {
			categoryId?: string
			filters?: Record<string, string[]>
		}

		let products = await prisma.product.findMany({
			where: categoryId ? { categoryId } : {},
		})

		if (filters && Object.keys(filters).length > 0) {
			products = products.filter(product => {
				const ingredients = JSON.parse(product.ingredients)
				return Object.entries(filters).every(([_, options]) => {
					if (!options.length) return true
					return options.some(opt => ingredients.includes(opt))
				})
			})
		}

		res.json(products)
	} catch (e) {
		console.error('GET PRODUCTS ERROR:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

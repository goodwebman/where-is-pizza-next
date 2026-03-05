import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
export type UpdateProfileData = {
	email?: string
	username?: string
	phone?: string
	birthDate?: string
}

export const updateProfile = async (req: Request, res: Response) => {
	try {
		if (!req.session) {
			return res.status(401).json({ error: 'Unauthorized' })
		}

		const userId = req.session.userId
		const { email, username, phone, birthDate } = req.body as UpdateProfileData

		const user = await prisma.user.findUnique({
			where: { id: userId },
		})

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		if (email && email !== user.email) {
			const existingEmail = await prisma.user.findUnique({
				where: { email },
			})
			if (existingEmail) {
				return res.status(400).json({ error: 'Email already in use' })
			}
		}

		if (username && username !== user.username) {
			const existingUsername = await prisma.user.findUnique({
				where: { username },
			})
			if (existingUsername) {
				return res.status(400).json({ error: 'Username already taken' })
			}
		}

		if (phone && phone !== user.phone) {
			const existingPhone = await prisma.user.findUnique({
				where: { phone },
			})
			if (existingPhone) {
				return res.status(400).json({ error: 'Phone already in use' })
			}
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: {
				email: email ?? undefined,
				username: username ?? undefined,
				phone: phone ?? undefined,
				birthDate: birthDate ? new Date(birthDate) : undefined,
			},
		})

		res.json({
			id: updatedUser.id,
			email: updatedUser.email,
			username: updatedUser.username,
			phone: updatedUser.phone,
			birthDate: updatedUser.birthDate,
		})
	} catch (e) {
		console.error('UPDATE PROFILE ERROR:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

export const getProfile = async (req: Request, res: Response) => {
	try {
		if (!req.session) {
			return res.status(401).json({ error: 'Unauthorized' })
		}

		const userId = req.session.userId

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true,
				username: true,
				phone: true,
				birthDate: true,
			},
		})

		if (!user) {
			return res.status(404).json({ error: 'User not found' })
		}

		res.json(user)
	} catch (e) {
		console.error('GET PROFILE ERROR:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { JWTHandler } from '../jwt'
import { mergeGuestCart } from './cart-controller'
import { LoginData, RegisterData } from './types'

const jwt = new JWTHandler(process.env.JWT_SECRET || 'secret')

const REFRESH_EXPIRY = 30 * 24 * 60 * 60 * 1000 // 30 дней
const ACCESS_EXPIRY = 15 * 60 // 15 минут

const createTokens = async (userId: number, username: string) => {
	const accessToken = jwt.createAccessToken({ userId, username }, ACCESS_EXPIRY)
	const refreshToken = jwt.createRefreshToken()

	await prisma.refreshToken.create({
		data: {
			token: refreshToken,
			userId,
			expiresAt: new Date(Date.now() + REFRESH_EXPIRY),
		},
	})

	return { accessToken, refreshToken }
}

export const register = async (req: Request, res: Response) => {
	try {
		const { email, username, password } = req.body as RegisterData

		if (!email || !username || !password) {
			return res.status(400).json({ error: 'Missing fields' })
		}

		const existingEmail = await prisma.user.findUnique({ where: { email } })
		if (existingEmail) {
			return res.status(400).json({ error: 'Email already registered' })
		}

		const existingUsername = await prisma.user.findUnique({
			where: { username },
		})
		if (existingUsername) {
			return res.status(400).json({ error: 'Username already taken' })
		}

		const hashed = await bcrypt.hash(password, 10)

		const user = await prisma.user.create({
			data: { email, username, password: hashed },
		})

		// --- Merge guest cart here ---
		const guestCartId = req.cookies?.cartId
		if (guestCartId) {
			await mergeGuestCart(guestCartId, user.id)
		}

		const tokens = await createTokens(user.id, user.username)

		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: REFRESH_EXPIRY,
		})

		res.json({
			token: tokens.accessToken,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
			},
		})
	} catch (e) {
		console.error('REGISTER ERROR:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body as LoginData

		if (!email || !password) {
			return res.status(400).json({ error: 'Missing fields' })
		}

		const user = await prisma.user.findUnique({ where: { email } })
		if (!user) return res.status(401).json({ error: 'Invalid credentials' })

		const valid = await bcrypt.compare(password, user.password)
		if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

		const guestCartId = req.cookies?.cartId
		if (guestCartId) {
			await mergeGuestCart(guestCartId, user.id)
		}

		const tokens = await createTokens(user.id, user.username)

		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: REFRESH_EXPIRY,
		})

		res.json({
			token: tokens.accessToken,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
			},
		})
	} catch (e) {
		console.error('LOGIN ERROR:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

export const logout = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies?.refreshToken
		if (refreshToken) {
			await prisma.refreshToken.deleteMany({
				where: { token: refreshToken },
			})
		}

		// Чистим cookie
		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
		})

		res.json({ success: true })
	} catch (e) {
		console.error('LOGOUT ERROR:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

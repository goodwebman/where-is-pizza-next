import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { JWTHandler } from '../jwt'

const prisma = new PrismaClient()
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
		const { username, password } = req.body
		const exists = await prisma.user.findUnique({ where: { username } })
		if (exists) return res.status(400).json({ error: 'Username exists' })

		const hashed = await bcrypt.hash(password, 10)
		const user = await prisma.user.create({
			data: { username, password: hashed },
		})

		const tokens = await createTokens(user.id, user.username)

		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: false,
			maxAge: REFRESH_EXPIRY,
		})
		res.json({ token: tokens.accessToken, username: user.username })
	} catch {
		res.status(500).json({ error: 'Server error' })
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body
		const user = await prisma.user.findUnique({ where: { username } })
		if (!user) return res.status(401).json({ error: 'Invalid credentials' })

		const valid = await bcrypt.compare(password, user.password)
		if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

		const tokens = await createTokens(user.id, user.username)
		res.cookie('refreshToken', tokens.refreshToken, {
			httpOnly: true,
			secure: false,
			maxAge: REFRESH_EXPIRY,
		})

		res.json({ token: tokens.accessToken, username: user.username })
	} catch {
		res.status(500).json({ error: 'Server error' })
	}
}

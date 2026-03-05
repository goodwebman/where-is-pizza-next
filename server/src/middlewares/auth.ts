import { NextFunction, Request, Response } from 'express'
import { JWTHandler } from '../jwt'

const jwt = new JWTHandler(process.env.JWT_SECRET || 'secret')

export type Session = { userId: number }

declare global {
	namespace Express {
		interface Request {
			session?: Session
		}
	}
}

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization

	const token = authHeader?.split(' ')[1]

	if (!token) return res.status(401).json({ error: 'Auth required' })

	if (!jwt.verifyToken(token))
		return res.status(403).json({ error: 'Invalid token' })

	const payload = jwt.getPayload(token) as Session
	req.session = { userId: payload.userId }
	next()
}

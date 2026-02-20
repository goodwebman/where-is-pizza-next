import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.routes'

const app = express()
const PORT = process.env.PORT || 4000

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
)

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	}),
)

app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

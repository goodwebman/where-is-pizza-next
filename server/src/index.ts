import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.routes'

const app = express()
const PORT = process.env.PORT || 4000

app.use(
	cors({
		origin: process.env.CLIENT_URL || 'http://localhost:5173',
		credentials: true,
	}),
)
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

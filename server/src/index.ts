import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

import path from 'path'
import authRoutes from './routes/auth.routes'
import cartRoutes from './routes/cart.routes'
import productRoutes from './routes/products.routes'

const app = express()
const PORT = process.env.PORT || 4000

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
	}),
)

app.use(express.json())
app.use(cookieParser())
app.use('/images', express.static(path.join(process.cwd(), 'public')))
app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

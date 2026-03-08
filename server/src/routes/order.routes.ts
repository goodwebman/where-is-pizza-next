import { Router } from 'express'
import {
  createOrder,
  getOrderById,
  getMyOrders,
} from '../controllers/order-controller'

const router = Router()

// Сначала /me
router.get('/me', getMyOrders)

// Потом :orderId
router.get('/:orderId', getOrderById)

// Создание заказа
router.post('/', createOrder)

export default router
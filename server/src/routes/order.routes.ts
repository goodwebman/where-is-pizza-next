import { Router } from 'express'
import {
  createOrder,
  getOrderById,
  getMyOrders,
} from '../controllers/order-controller'

const router = Router()

// Создать заказ (для залогиненных и гостей)
router.post('/', createOrder)

// Получить конкретный заказ по ID
router.get('/:orderId', getOrderById)

// Получить все заказы текущего пользователя
router.get('/me', getMyOrders)

export default router
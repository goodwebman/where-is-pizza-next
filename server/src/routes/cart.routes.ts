import { Router } from 'express'
import {
  addToCart,
  clearCartController,
  deleteFromCart,
  getCart,
  updateCartItem,
} from '../controllers/cart-controller'

const router = Router()

// Добавить товар в корзину
router.post('/', addToCart)

// Получить корзину
router.get('/', getCart)

// Удалить товар из корзины
router.delete('/:itemId', deleteFromCart)

// Обновить количество товара в корзине
router.patch('/:itemId', updateCartItem)
router.delete('/clear', clearCartController)

export default router
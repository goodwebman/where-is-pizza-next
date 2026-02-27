import { Router } from 'express'
import { addToCart, deleteFromCart, getCart, updateCartItem } from '../controllers/cart-controller'


const router = Router()

router.post('/', addToCart)
router.get('/', getCart)
router.delete('/:itemId', deleteFromCart)
router.patch('/:itemId', updateCartItem)

export default router
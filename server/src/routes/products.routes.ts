import { Router } from 'express'
import { getProducts } from '../controllers/product-controller'
import { getFiltersByCategory } from '../controllers/product-filters-controller'

const router = Router()

router.get('/filters/:categoryId', getFiltersByCategory)
router.post('/', getProducts)

export default router

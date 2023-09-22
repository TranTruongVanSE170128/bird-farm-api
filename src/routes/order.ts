import express from 'express'
import { validateRequestData } from '../middleware/validate-request-data'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { createOrder, getPaginationOrders, getPaginationOrdersAdmin, updateOrder } from '../controllers/order'
const router = express.Router()

router.get('/pagination', verifyToken, getPaginationOrders)
router.post('/', verifyToken, createOrder)
router.put('/:id', verifyToken, updateOrder)
router.get('/admin/pagination', verifyToken, checkRole([Role.Admin]), getPaginationOrdersAdmin)
export default router

import express from 'express'
import { validateRequestData } from '../middleware/validate-request-data'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import { createOrder, getPaginationOrders, getPaginationOrdersAdmin, updateOrder } from '../controllers/order'
const router = express.Router()

router.get('/pagination', verifyToken, checkRole([Role.Admin]), getPaginationOrders)
router.post('/', verifyToken, checkRole([Role.Admin]), createOrder)
router.put('/:id', verifyToken, checkRole([Role.Admin]), updateOrder)
router.get('admin/pagination', verifyToken, checkRole([Role.Admin]), getPaginationOrdersAdmin)
export default router

import express from 'express'
import { validateRequestData } from '../middleware/validate-request-data'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import {
  createOrder,
  getPaginationOrders,
  getPaginationOrdersAdmin,
  updateOrder,
  getOrderDetail,
  approveOrder
} from '../controllers/order'
const router = express.Router()

router.get('/pagination', verifyToken, getPaginationOrders)

router.post('/', verifyToken, createOrder)

router.get('/:id', verifyToken, checkRole([Role.Admin]), getOrderDetail)

router.put('/:id', verifyToken, checkRole([Role.Admin]), updateOrder)

router.put('/:id/approve', verifyToken, checkRole([Role.Admin]), approveOrder)

router.get('/pagination/admin', verifyToken, checkRole([Role.Admin]), getPaginationOrdersAdmin)
export default router

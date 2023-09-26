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
  receiveOrder
} from '../controllers/order'

const router = express.Router()
router.get('/pagination/admin', verifyToken, checkRole([Role.Admin]), getPaginationOrdersAdmin)
router.get('/pagination', verifyToken, getPaginationOrders)
router.put('/receive-goods', verifyToken, checkRole([Role.Customer]), receiveOrder)

router.get('/:id', verifyToken, checkRole([Role.Admin]), getOrderDetail)

router.put('/:id', verifyToken, checkRole([Role.Admin]), updateOrder)
router.post('/', verifyToken, createOrder)

export default router

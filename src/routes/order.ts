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
  approveOrder,
  receiveOrder,
  cancelOrder
} from '../controllers/order'
import {
  cancelOrderSchema,
  createOrderSchema,
  getOrderDetailSchema,
  getPaginationOrdersAdminSchema,
  getPaginationOrdersSchema,
  receiveOrderSchema,
  updateOrderSchema
} from '../validations/order'

const router = express.Router()
router.get(
  '/pagination/admin',
  verifyToken,
  validateRequestData(getPaginationOrdersAdminSchema),
  checkRole([Role.Admin]),
  getPaginationOrdersAdmin
)

router.put('/:id/receive', verifyToken, validateRequestData(receiveOrderSchema), receiveOrder)

router.put('/:id/cancel', validateRequestData(cancelOrderSchema), cancelOrder)

router.put('/:id/approve', verifyToken, checkRole([Role.Admin]), approveOrder)

router.get('/pagination', verifyToken, validateRequestData(getPaginationOrdersSchema), getPaginationOrders)

router.get('/:id', verifyToken, validateRequestData(getOrderDetailSchema), checkRole([Role.Admin]), getOrderDetail)

router.put('/:id', verifyToken, validateRequestData(updateOrderSchema), checkRole([Role.Admin]), updateOrder)

router.post('/', validateRequestData(createOrderSchema), verifyToken, createOrder)

router.post('/', verifyToken, createOrder)

export default router

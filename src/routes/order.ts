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
import {
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
router.put('/receive-order/:id', verifyToken, validateRequestData(receiveOrderSchema), receiveOrder)
router.get('/pagination', verifyToken, validateRequestData(getPaginationOrdersSchema), getPaginationOrders)
router.get('/:id', verifyToken, validateRequestData(getOrderDetailSchema), checkRole([Role.Admin]), getOrderDetail)
router.put('/:id', verifyToken, validateRequestData(updateOrderSchema), checkRole([Role.Admin]), updateOrder)
router.post('/', validateRequestData(createOrderSchema), verifyToken, createOrder)

export default router

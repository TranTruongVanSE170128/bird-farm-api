import express from 'express'
import { validateRequestData } from '../middleware/validate-request-data'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import {
  createOrder,
  getPaginationOrders,
  getPaginationOrdersManage,
  updateOrder,
  getOrderDetail,
  approveOrder,
  receiveOrder,
  cancelOrder,
  sendOrderToMail
} from '../controllers/order'
import {
  cancelOrderSchema,
  createOrderSchema,
  getOrderDetailSchema,
  getPaginationOrdersManageSchema,
  getPaginationOrdersSchema,
  receiveOrderSchema,
  sendOrderToMailSchema,
  updateOrderSchema
} from '../validations/order'

const router = express.Router()

router.get(
  '/pagination/manage',
  verifyToken,
  validateRequestData(getPaginationOrdersManageSchema),
  checkRole([Role.Staff]),
  getPaginationOrdersManage
)
router.get('/:id/send-order-to-mail', verifyToken, validateRequestData(sendOrderToMailSchema), sendOrderToMail)
router.put(
  '/:id/receive',
  verifyToken,
  checkRole([Role.Customer]),
  validateRequestData(receiveOrderSchema),
  receiveOrder
)

router.put(
  '/:id/cancel',
  verifyToken,
  checkRole([Role.Staff, Role.Customer]),
  validateRequestData(cancelOrderSchema),
  cancelOrder
)

router.put('/:id/approve', verifyToken, checkRole([Role.Staff]), approveOrder)

router.get('/pagination', verifyToken, validateRequestData(getPaginationOrdersSchema), getPaginationOrders)

router.get('/:id', verifyToken, validateRequestData(getOrderDetailSchema), checkRole([Role.Staff]), getOrderDetail)

router.put('/:id', verifyToken, validateRequestData(updateOrderSchema), checkRole([Role.Staff]), updateOrder)

router.post('/', verifyToken, checkRole([Role.Customer]), validateRequestData(createOrderSchema), createOrder)

export default router

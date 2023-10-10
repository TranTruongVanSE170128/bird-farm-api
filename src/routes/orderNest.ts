import express from 'express'
import { validateRequestData } from '../middleware/validate-request-data'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'
import {
  addStage,
  approveOrderNest,
  cancelOrderNest,
  // createOrderNest,
  getOrderNestDetail,
  getPaginationOrderNests,
  getPaginationOrderNestsManage,
  paymentTheRest,
  receiveOrderNest,
  requestCustomerToPayment,
  updateBirdAmount
} from '../controllers/orderNest'
import {
  addStageSchema,
  approveOrderNestSchema,
  cancelOrderNestSchema,
  // createOrderNestSchema,
  getOrderNestDetailSchema,
  getPaginationOrderNestsManageSchema,
  getPaginationOrderNestsSchema,
  paymentTheRestSchema,
  receiveOrderNestSchema,
  requestCustomerToPaymentSchema,
  updateBirdAmountSchema
} from '../validations/orderNest'

const router = express.Router()

router.get(
  '/pagination/manage',
  verifyToken,
  validateRequestData(getPaginationOrderNestsManageSchema),
  checkRole([Role.Staff]),
  getPaginationOrderNestsManage
)
router.put(
  '/:id/update-bird-amount',
  verifyToken,
  checkRole([Role.Staff]),
  validateRequestData(updateBirdAmountSchema),
  updateBirdAmount
)
router.put(
  '/:id/approve',
  verifyToken,
  checkRole([Role.Staff]),
  validateRequestData(approveOrderNestSchema),
  approveOrderNest
)
router.put(
  '/:id/cancel',
  verifyToken,
  checkRole([Role.Staff, Role.Customer]),
  validateRequestData(cancelOrderNestSchema),
  cancelOrderNest
)
router.put(
  '/:id/receive',
  verifyToken,
  checkRole([Role.Customer]),
  validateRequestData(receiveOrderNestSchema),
  receiveOrderNest
)

router.post('/:id/add-stage', verifyToken, validateRequestData(addStageSchema), checkRole([Role.Staff]), addStage)

router.post(
  '/:id/payment-rest',
  verifyToken,
  checkRole([Role.Customer]),
  validateRequestData(paymentTheRestSchema),
  paymentTheRest
)

router.put(
  '/:id/request-payment',
  verifyToken,
  validateRequestData(requestCustomerToPaymentSchema),
  checkRole([Role.Staff]),
  requestCustomerToPayment
)

router.get('/pagination', verifyToken, validateRequestData(getPaginationOrderNestsSchema), getPaginationOrderNests)

router.get(
  '/:id',
  verifyToken,
  validateRequestData(getOrderNestDetailSchema),
  checkRole([Role.Staff]),
  getOrderNestDetail
)

export default router

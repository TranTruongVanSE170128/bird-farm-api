import express from 'express'
import { addDeliveryInfo, deleteDeliveryInfo, makeDefaultDeliveryInfo, updateUser, whoAmI } from '../controllers/user'
import verifyToken from '../middleware/auth'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  addDeliveryInfoSchema,
  deleteDeliveryInfoSchema,
  makeDefaultDeliveryInfoSchema,
  updateUserSchema
} from '../validations/user'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'

const router = express.Router()

router.put(
  '/delivery-info/:id/make-default',
  verifyToken,
  validateRequestData(makeDefaultDeliveryInfoSchema),
  makeDefaultDeliveryInfo
)

router.post(
  '/delivery-info',
  verifyToken,
  checkRole([Role.Customer]),
  validateRequestData(addDeliveryInfoSchema),
  addDeliveryInfo
)

router.delete(
  '/delivery-info/:id',
  verifyToken,
  checkRole([Role.Customer]),
  validateRequestData(deleteDeliveryInfoSchema),
  deleteDeliveryInfo
)

router.get('/who-am-i', verifyToken, whoAmI)

router.post('/:id', verifyToken, validateRequestData(updateUserSchema), updateUser)

export default router

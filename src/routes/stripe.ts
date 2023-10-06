import express from 'express'
import { createCheckoutSession, createDepositSession, createPaymentRestSession } from '../controllers/stripe'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  createCheckoutSessionSchema,
  createDepositSessionSchema,
  createPaymentRestSessionSchema
} from '../validations/checkout'
import verifyToken from '../middleware/auth'
import checkRole from '../middleware/checkRole'
import { Role } from '../typings/types'

const router = express.Router()

router.post(
  '/create-checkout-session',
  verifyToken,
  checkRole([Role.Customer]),
  validateRequestData(createCheckoutSessionSchema),
  createCheckoutSession
)

router.post(
  '/create-deposit-session',
  verifyToken,
  checkRole([Role.Customer]),
  validateRequestData(createDepositSessionSchema),
  createDepositSession
)

router.post(
  '/create-payment-rest-session',
  verifyToken,
  checkRole([Role.Customer]),
  validateRequestData(createPaymentRestSessionSchema),
  createPaymentRestSession
)

export default router

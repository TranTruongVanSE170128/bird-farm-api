import express from 'express'
import {
  createCheckoutSession,
  createDepositSession,
  stripeWebhook,
  createPaymentRestSession
} from '../controllers/stripe'
import { validateRequestData } from '../middleware/validate-request-data'
import {
  createCheckoutSessionSchema,
  createDepositSessionSchema,
  createPaymentRestSessionSchema
} from '../validations/checkout'
import verifyToken from '../middleware/auth'

const router = express.Router()

router.post(
  '/create-checkout-session',
  verifyToken,
  validateRequestData(createCheckoutSessionSchema),
  createCheckoutSession
)

router.post(
  '/create-deposit-session',
  verifyToken,
  validateRequestData(createDepositSessionSchema),
  createDepositSession
)

router.post(
  '/create-payment-rest-session',
  verifyToken,
  validateRequestData(createPaymentRestSessionSchema),
  createPaymentRestSession
)

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

export default router

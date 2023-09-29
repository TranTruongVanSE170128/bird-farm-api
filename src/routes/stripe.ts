import express from 'express'
import { createCheckoutSession, createDepositSession, stripeWebhook } from '../controllers/stripe'
import { validateRequestData } from '../middleware/validate-request-data'
import { createCheckoutSessionSchema, createDepositSessionSchema } from '../validations/checkout'
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

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

export default router

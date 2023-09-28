import express from 'express'
import { createCheckoutSession, stripeWebhook } from '../controllers/stripe'
import { validateRequestData } from '../middleware/validate-request-data'
import { createCheckoutSessionSchema } from '../validations/checkout'
import verifyToken from '../middleware/auth'

const router = express.Router()

router.post(
  '/create-checkout-session',
  verifyToken,
  validateRequestData(createCheckoutSessionSchema),
  createCheckoutSession
)

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook)

export default router

import express from 'express'
import { createCheckoutSession } from '../controllers/checkout'
import { validateRequestData } from '../middleware/validate-request-data'
import { createCheckoutSessionSchema } from '../validations/checkout'
const router = express.Router()

router.post('/create-checkout-session', validateRequestData(createCheckoutSessionSchema), createCheckoutSession)

export default router

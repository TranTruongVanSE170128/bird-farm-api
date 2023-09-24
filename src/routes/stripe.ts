import express from 'express'
import { createCheckoutSession } from '../controllers/stripe'
import { validateRequestData } from '../middleware/validate-request-data'
import { createCheckoutSessionSchema } from '../validations/checkout'
import Stripe from 'stripe'
import verifyToken from '../middleware/auth'

const router = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {} as Stripe.StripeConfig)

router.post(
  '/create-checkout-session',
  verifyToken,
  validateRequestData(createCheckoutSessionSchema),
  createCheckoutSession
)

const endpointSecret = 'whsec_fb52b06822f597f1658fd0330e2036b3c867eadabb1733a70ed27b3e5321d6bb'

router.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature']

  let data: any
  let eventType

  if (endpointSecret) {
    let event

    try {
      event = stripe.webhooks.constructEvent(request.body, sig!, endpointSecret)
    } catch (err: any) {
      response.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    data = event.data.object
    eventType = event.type
  } else {
    data = request.body.data.object
    eventType = request.body.type
  }

  // Handle the event
  if (eventType === 'checkout.session.completed') {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        console.log({ data, customer })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  response.send()
})

export default router

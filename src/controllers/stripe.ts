import { Request, Response } from 'express'
import mongoose, { isValidObjectId } from 'mongoose'
import Stripe from 'stripe'
import Bird from '../models/bird'
import Nest from '../models/nest'
import { zParse } from '../helpers/z-parse'
import { createCheckoutSessionSchema } from '../validations/checkout'
import Order from '../models/order'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {} as Stripe.StripeConfig)

export const createCheckoutSession = async (req: Request, res: Response) => {
  const {
    body: { products, receiver, address, phone, notice }
  } = await zParse(createCheckoutSessionSchema, req)

  try {
    const { birds: birdIds } = products
    const validBirdIds = birdIds.filter((id: string) => isValidObjectId(id))
    const birds = await Bird.find({ _id: { $in: validBirdIds } })

    const { nests: nestIds } = products
    const validNestIds = nestIds.filter((id: string) => isValidObjectId(id))
    const nests = await Nest.find({ _id: { $in: validNestIds } })

    const lineBirdItems = birds.map((bird) => {
      return {
        price_data: {
          currency: 'VND',
          product_data: {
            name: bird.name
          },
          unit_amount: bird.sellPrice
        },
        quantity: 1
      }
    })

    const lineNestItems = nests.map((nest) => {
      return {
        price_data: {
          currency: 'VND',
          product_data: {
            name: nest.name
          },
          unit_amount: nest.price
        },
        quantity: 1
      }
    })

    const customer = await stripe.customers.create({
      metadata: {
        userId: res.locals.user.id,
        data: JSON.stringify({
          birds: birdIds,
          nests: nestIds,
          receiver,
          address,
          phone,
          notice
        })
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [...lineBirdItems, ...lineNestItems],
      customer: customer.id,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/orders/payment-success`,
      cancel_url: `${process.env.BASE_URL}/orders/payment-cancel`
    })

    res.status(200).json({ id: session.id })
  } catch (error) {
    console.log(error)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống' })
  }
}

export const stripeWebhook = (req: Request, res: Response) => {
  const endpointSecret = 'whsec_fb52b06822f597f1658fd0330e2036b3c867eadabb1733a70ed27b3e5321d6bb'
  const sig = req.headers['stripe-signature']

  let data: any
  let eventType

  if (endpointSecret) {
    let event

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret)
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    data = event.data.object
    eventType = event.type
  } else {
    data = req.body.data.object
    eventType = req.body.type
  }

  // Handle the event
  if (eventType === 'checkout.session.completed') {
    stripe.customers
      .retrieve(data.customer)
      .then(async (customer: any) => {
        const data = JSON.parse(customer.metadata.data)
        const birdIds = data.birds
        const nestIds = data.nests

        let totalMoney = 0
        const birds = await Bird.find({ _id: { $in: birdIds } })
        const nests = await Nest.find({ _id: { $in: nestIds } })

        birds.forEach((bird) => {
          totalMoney += bird?.sellPrice || 0
        })

        nests.forEach((nest) => {
          totalMoney += nest?.price || 0
        })

        const newOrder = new Order({
          ...data,
          totalMoney,
          user: new mongoose.Types.ObjectId(customer.metadata.userId),
          methodPayment: 'online'
        })
        await newOrder.save()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  res.send()
}

import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import Stripe from 'stripe'
import bird from '../models/bird'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {} as Stripe.StripeConfig)

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { products } = req.body

  try {
    const { birds: birdRecords } = products
    const birdIds = Object.keys(birdRecords)
    const validIds = birdIds.filter((id: string) => isValidObjectId(id))
    const birds = await bird.find({ _id: { $in: validIds } })

    const lineItems = birds.map((bird) => {
      return {
        price_data: {
          currency: 'VND',
          product_data: {
            name: bird.name
          },
          unit_amount: bird.price
        },
        quantity: birdRecords[bird.id]
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5000/success.html',
      cancel_url: 'http://localhost:5000/cancel.html'
    })

    res.status(200).json({ id: session.id })
  } catch (error) {
    console.log(error)

    res.status(500).json({ success: false, message: 'Lỗi hệ thống' })
  }
}

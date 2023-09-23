import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'
import Stripe from 'stripe'
import Bird from '../models/bird'
import Nest from '../models/nest'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {} as Stripe.StripeConfig)

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { products } = req.body

  try {
    const { birds: birdRecords } = products
    const birdIds = Object.keys(birdRecords)
    const validBirdIds = birdIds.filter((id: string) => isValidObjectId(id))
    const birds = await Bird.find({ _id: { $in: validBirdIds } })

    const { nests: nestRecords } = products
    const nestIds = Object.keys(nestRecords)
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
        quantity: birdRecords[bird.id]
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
        quantity: nestRecords[nest.id]
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [...lineBirdItems, ...lineNestItems],
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

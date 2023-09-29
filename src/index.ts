import express from 'express'
import cors from 'cors'
import authRoute from './routes/auth'
import morgan from 'morgan'
import mongoose from 'mongoose'
import specieRoute from './routes/specie'
import birdRoute from './routes/bird'
import userRoute from './routes/user'
import stripeRoute from './routes/stripe'
import nestRoute from './routes/nest'
import orderRoute from './routes/order'
import ratingRoute from './routes/rating'
import orderNestRoute from './routes/orderNest'

import { config } from 'dotenv'
import Stripe from 'stripe'
import { stripeWebhook } from './controllers/stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {} as Stripe.StripeConfig)

config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('Mongoose connected successfully')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

connectDB()

const app = express()

app.use(express.static('public'))
app.use(morgan('dev'))
app.use(cors({ credentials: true }))
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook)
app.use(express.json())
app.get('/', (req, res) => {
  res.json({ hello: 'hello world!' })
})
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/ratings', ratingRoute)
app.use('/api/species', specieRoute)
app.use('/api/birds', birdRoute)
app.use('/api/stripe', stripeRoute)
app.use('/api/nests', nestRoute)
app.use('/api/orders', orderRoute)
app.use('/api/order-nests', orderNestRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

export default app

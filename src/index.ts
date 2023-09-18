import express from 'express'
import cors from 'cors'
import authRoute from './routes/auth'
import morgan from 'morgan'
import mongoose from 'mongoose'
import specieRoute from './routes/specie'
import birdRoute from './routes/bird'
import userRoute from './routes/user'
import checkoutRoute from './routes/checkout'
import adminBirdRoute from './routes/admin-bird'
import { config } from 'dotenv'

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
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ hello: 'hello world!' })
})

app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/species', specieRoute)
app.use('/api/birds', birdRoute)
app.use('/api/checkout', checkoutRoute)

app.use('/api/admin/birds', adminBirdRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

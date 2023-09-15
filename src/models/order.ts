import mongoose from 'mongoose'
import { number } from 'zod'

const OrderSchema = new mongoose.Schema(
  {
    receiver: String,
    phone: String,
    address: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    birds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Bird' },
    status: String,
    totalMoney: number,
    date: Date
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)

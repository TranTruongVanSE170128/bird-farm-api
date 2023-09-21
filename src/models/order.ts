import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    receiver: String,
    phone: String,
    address: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    birds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Bird' },
    status: { type: String, enum: ['processing', 'delivering', 'success', 'canceled'], default: 'processing' },
    totalMoney: Number,
    date: Date
  },
  { timestamps: true }
)

export default mongoose.model('Order', OrderSchema)

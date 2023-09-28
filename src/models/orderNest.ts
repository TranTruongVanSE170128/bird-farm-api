import mongoose from 'mongoose'
import { string } from 'zod'

const OrderNestSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Types.ObjectId, require: true, ref: 'User' },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' },
    deposit: { type: Number, require: true },
    childPriceMale: { type: Number, require: true },
    childPriceFemale: { type: Number, require: true },
    status: {
      type: String,
      enum: ['processing', 'breeding', 'delivering', 'success', 'canceled'],
      default: 'processing'
    },
    stages: [
      {
        status: Boolean,
        imageUrl: String,
        description: String,
        numberOfChild: Number
      }
    ],
    totalMoney: { type: Number },
    rated: { type: Boolean, default: false },
    receiver: { type: String, require: true },
    address: { type: String, require: true },
    phone: { type: String, require: true },
    dad: { type: mongoose.Types.ObjectId, ref: 'Bird', require: true },
    mom: { type: mongoose.Types.ObjectId, ref: 'Bird', require: true },
    methodPayment: { type: String, enum: ['cod', 'online'], require: true }
  },
  { timestamps: true }
)

export default mongoose.model('OrderNest', OrderNestSchema)

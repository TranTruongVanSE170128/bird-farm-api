import mongoose from 'mongoose'

const OrderNestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'User' },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' },
    childPriceMale: { type: Number, require: true },
    childPriceFemale: { type: Number, require: true },
    numberChildPriceMale: { type: Number, require: true, default: 0 },
    numberChildPriceFemale: { type: Number, require: true, default: 0 },
    status: {
      type: String,
      enum: ['processing', 'breeding', 'delivering', 'success', 'canceled', 'wait-for-payment'],
      default: 'processing'
    },
    stages: {
      type: [
        {
          name: String,
          imageUrl: String,
          description: String
        }
      ],
      default: []
    },
    rated: { type: Boolean, default: false },
    receiver: String,
    address: String,
    phone: String,
    dad: { type: mongoose.Types.ObjectId, ref: 'Bird', require: true },
    mom: { type: mongoose.Types.ObjectId, ref: 'Bird', require: true },
    specie: { type: mongoose.Types.ObjectId, ref: 'Specie', require: true },
    totalMoney: Number,
    notice: String,
    methodPayment: { type: String, enum: ['cod', 'online'] }
  },
  { timestamps: true }
)

export default mongoose.model('OrderNest', OrderNestSchema)

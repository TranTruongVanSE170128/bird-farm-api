import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    receiver: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    birds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Bird', default: [] },
    nests: { type: [mongoose.Schema.Types.ObjectId], ref: 'Nest', default: [] },
    totalMoney: { type: Number, required: true },
    status: {
      type: String,
      enum: ['processing', 'delivering', 'success', 'canceled'],
      require: true,
      default: 'processing'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', OrderSchema)

import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    receiver: { type: String, require: true },
    phone: { type: String, require: true },
    address: { type: String, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    birds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Bird' },
    nests: { type: [mongoose.Schema.Types.ObjectId], ref: 'Nest' },
    status: { type: String, enum: ['processing', 'delivering', 'success', 'canceled'], default: 'processing' },
    totalMoney: { type: Number, require: true },
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }
  },
  { timestamps: true }
)

export default mongoose.model('Order', OrderSchema)

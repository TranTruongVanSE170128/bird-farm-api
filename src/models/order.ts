import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema(
  {
    receiver: { type: String, require: true },
    phone: { type: String, require: true },
    address: { type: String, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    birds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Bird' },
    rated: { type: Boolean, default: false },
    nests: { type: [mongoose.Schema.Types.ObjectId], ref: 'Nest' },
    status: { type: String, enum: ['processing', 'delivering', 'success', 'canceled'], default: 'processing' },
    statusMessage: String,
    totalMoney: { type: Number, require: true },
    discount: Number,
    methodPayment: { type: String, enum: ['cod', 'online'], require: true },
    notice: String,
    voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' }
  },
  { timestamps: true }
)

export default mongoose.model('Order', OrderSchema)

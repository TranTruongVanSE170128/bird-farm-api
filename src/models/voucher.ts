import mongoose from 'mongoose'

const VoucherSchema = new mongoose.Schema(
  {
    discountPercent: { type: Number, require: true, default: 0 },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxDiscountValue: { type: Number, require: true, default: 0 },
    conditionPrice: { type: Number, require: true, default: 0 },
    expiredAt: { type: Date, require: true, default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    quantity: { type: Number, require: true, default: 0 },
    enable: { type: Boolean, require: true, default: true }
  },
  { timestamps: true }
)

export default mongoose.model('Voucher', VoucherSchema)

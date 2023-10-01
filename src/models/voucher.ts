import mongoose from 'mongoose'

const VoucherSchema = new mongoose.Schema(
  {
    discountPercent: { type: Number, require: true },
    maxDiscountValue: { type: Number, require: true },
    conditionPrice: { type: Number, require: true },
    expiredAt: { type: Date, require: true },
    quantity: { type: Number, require: true }
  },
  { timestamps: true }
)

export default mongoose.model('Voucher', VoucherSchema)

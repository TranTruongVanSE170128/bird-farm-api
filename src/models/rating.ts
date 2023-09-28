import mongoose from 'mongoose'

const RatingSchema = new mongoose.Schema(
  {
    content: String,
    value: { type: Number, require: true, defaultValue: 5 },
    imageUrls: [String],
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    orderNest: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderNest' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

export default mongoose.model('Rating', RatingSchema)

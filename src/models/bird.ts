import mongoose from 'mongoose'

const BirdSchema = new mongoose.Schema({
  birth: Date,
  description: String,
  imageUrls: [String],
  name: { type: String, unique: true, required: true },
  price: { type: Number, require: true },
  sold: { type: Boolean, default: false },
  onSale: { type: Boolean, default: true },
  specie: { type: mongoose.Schema.Types.ObjectId, ref: 'Specie', require: true },
  gender: { type: String, enum: ['male', 'female'], require: true },
  discount: {
    discountPercent: Number,
    startDate: Date,
    endDate: Date
  },
  achievements: [
    {
      competition: String,
      rank: Number
    }
  ],
  parent: {
    dad: { type: mongoose.Schema.Types.ObjectId, ref: 'Bird' },
    mom: { type: mongoose.Schema.Types.ObjectId, ref: 'Bird' }
  }
})

export default mongoose.model('Bird', BirdSchema)

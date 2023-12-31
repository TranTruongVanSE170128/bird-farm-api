import mongoose from 'mongoose'

const NestSchema = new mongoose.Schema(
  {
    specie: { type: mongoose.Types.ObjectId, ref: 'Specie', required: true },
    dad: { type: mongoose.Types.ObjectId, ref: 'Bird' },
    mom: { type: mongoose.Types.ObjectId, ref: 'Bird' },
    name: { type: String, unique: true, required: true },
    sold: { type: Boolean, default: false },
    price: { type: Number, default: true },
    imageUrls: [String],
    description: String
  },
  { timestamps: true }
)

export default mongoose.model('Nest', NestSchema)

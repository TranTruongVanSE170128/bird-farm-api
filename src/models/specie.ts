import mongoose from 'mongoose'

const SpecieSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    imageUrl: String,
    description: String
  },
  { timestamps: true }
)

export default mongoose.model('Specie', SpecieSchema)

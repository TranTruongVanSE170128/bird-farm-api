import mongoose from 'mongoose'

const RatingSchema = new mongoose.Schema(
  {
    content: String,
    value: String,
    imageUrls: [String]
  },
  { timestamps: true }
)

export default mongoose.model('Rating', RatingSchema)

import mongoose from 'mongoose'

const MediaSchema = new mongoose.Schema(
  {
    defaultAvatarUrl: { type: String, required: true },
    bannerUrls: {
      type: [String],
      required: true,
      default: []
    }
  },
  { timestamps: true }
)

export default mongoose.model('Media', MediaSchema)

import mongoose from 'mongoose'

const BirdSchema = new mongoose.Schema({
  name: String,
  nickname: String,
  birth: Date,
  price: Number,
  sold: Boolean,
  onState: Boolean,
  description: String,
  specie: { type: mongoose.Schema.Types.ObjectId, ref: 'Specie' },
  gender: { type: String, enum: ['male', 'female'] },
  imageUrls: [String],
  growingImageUrls: [String],
  achievements: [
    {
      competition: String,
      rank: Number
    }
  ],
  breeds: [
    {
      children: { type: [mongoose.Schema.Types.ObjectId], ref: 'Bird' }, //ref
      date: Date
    }
  ],
  parent: {
    dad: { type: mongoose.Schema.Types.ObjectId, ref: 'Bird' },
    mom: { type: mongoose.Schema.Types.ObjectId, ref: 'Bird' }
  }
})

module.exports = mongoose.model('Bird', BirdSchema)

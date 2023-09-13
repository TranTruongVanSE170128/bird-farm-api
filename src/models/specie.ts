import mongoose from 'mongoose'

const SpecieSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  description: String,
  code: String
})

export default mongoose.model('Specie', SpecieSchema)

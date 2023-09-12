import mongoose from 'mongoose'

const SpecieSchema = new mongoose.Schema({
  name: String
})

module.exports = mongoose.model('Specie', SpecieSchema)

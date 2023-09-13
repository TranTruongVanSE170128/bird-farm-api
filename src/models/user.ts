import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  imageUrl: String,
  resetPasswordCode: String,
  verifyCode: String,
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ['customer', 'admin', 'staff', 'manager'] },
  deliveryInfos: [
    {
      receiver: String,
      phone: String,
      address: String,
      default: Boolean
    }
  ]
})

export default mongoose.model('User', UserSchema)

import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  imageUrl: String,
  resetPasswordCode: String,
  verifyCode: String,
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ['customer', 'admin', 'staff', 'manager'], default: 'customer' },
  deliveryInfos: [
    {
      receiver: String,
      phone: String,
      address: String,
      default: Boolean
    }
  ],
  notifications: [
    {
      content: String,
      imageUrl: String,
      date: Date,
      link: String
    }
  ]
})

export default mongoose.model('User', UserSchema)

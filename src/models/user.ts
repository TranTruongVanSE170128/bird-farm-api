import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    password: String,
    imageUrl: String,
    resetPasswordCode: String,
    verifyCode: String,
    name: { type: String, require: true },
    email: { type: String, require: true },
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
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)

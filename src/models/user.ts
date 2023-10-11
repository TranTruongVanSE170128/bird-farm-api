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
        receiver: { type: String, require: true },
        phone: { type: String, require: true },
        address: { type: String, require: true },
        default: { type: Boolean, default: false, require: true },
        _id: { type: mongoose.Schema.Types.ObjectId, require: true }
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

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  imageUrl: String,
  role: { type: String, enum: ['customer', 'admin', 'staff', 'manager'] },
  deliveryInfos: [
    {
      receiver: String,
      phone: String,
      address: String,
      default: Boolean,
    },
  ],
});

export default mongoose.model('User', UserSchema);

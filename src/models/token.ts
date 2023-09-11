import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
    unique: true,
  },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

export default mongoose.model('Token', TokenSchema);

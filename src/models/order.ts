import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    receiver: String,
    phone: String,
    address: String,
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    birds: { type: [mongoose.Schema.Types.ObjectId], ref: 'Bird' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);

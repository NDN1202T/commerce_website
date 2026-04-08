const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  method: { type: String, required: true }, // e.g., 'credit_card', 'paypal', 'cash'
  status: { type: String, default: 'pending' }, // 'pending', 'completed', 'failed'
  cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
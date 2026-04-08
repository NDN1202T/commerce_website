const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);
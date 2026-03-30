const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 },
  image: { type: String, default: null } // Cho phép để trống ảnh
}, { timestamps: true }); // Tự động thêm thời gian tạo và cập nhật

module.exports = mongoose.model('Product', ProductSchema);
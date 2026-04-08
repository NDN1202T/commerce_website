const Payment = require('../models/Payment');
const Cart = require('../models/Cart');

// 1. Lấy danh sách thanh toán
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('cartId');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Tạo thanh toán mới
exports.createPayment = async (req, res) => {
  try {
    const { amount, method, cartId } = req.body;
    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

    const newPayment = new Payment({
      amount,
      method,
      cartId
    });
    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 3. Cập nhật trạng thái thanh toán
exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedPayment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedPayment) return res.status(404).json({ message: 'Thanh toán không tồn tại' });
    res.json(updatedPayment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Xóa thanh toán
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) return res.status(404).json({ message: 'Thanh toán không tồn tại' });
    res.json({ message: 'Thanh toán đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
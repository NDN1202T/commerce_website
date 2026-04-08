const Cart = require('../../cart/commerce_website/src/models/Cart');
const Product = require('../models/Product');

// 1. Lấy giỏ hàng (giả sử chỉ có một giỏ hàng, hoặc theo userId nếu có auth)
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.productId');
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng trống' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    // Tính tổng giá
    cart.totalPrice = cart.items.reduce((total, item) => {
      return total + (product.price * item.quantity);
    }, 0);

    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 3. Cập nhật số lượng trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });

    item.quantity = quantity;

    // Tính lại tổng giá
    const products = await Product.find({ _id: { $in: cart.items.map(i => i.productId) } });
    cart.totalPrice = cart.items.reduce((total, item) => {
      const prod = products.find(p => p._id.toString() === item.productId.toString());
      return total + (prod.price * item.quantity);
    }, 0);

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // Tính lại tổng giá
    const products = await Product.find({ _id: { $in: cart.items.map(i => i.productId) } });
    cart.totalPrice = cart.items.reduce((total, item) => {
      const prod = products.find(p => p._id.toString() === item.productId.toString());
      return total + (prod.price * item.quantity);
    }, 0);

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete();
    res.json({ message: 'Giỏ hàng đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
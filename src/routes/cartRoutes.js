const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Lấy giỏ hàng: GET http://localhost:3000/api/cart
router.get('/', cartController.getCart);

// Thêm vào giỏ hàng: POST http://localhost:3000/api/cart
router.post('/', cartController.addToCart);

// Cập nhật item: PUT http://localhost:3000/api/cart
router.put('/', cartController.updateCartItem);

// Xóa item: DELETE http://localhost:3000/api/cart/:productId
router.delete('/:productId', cartController.removeFromCart);

// Xóa toàn bộ: DELETE http://localhost:3000/api/cart
router.delete('/', cartController.clearCart);

module.exports = router;
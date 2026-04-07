const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const { createCoupon, applyCoupon } = require('../controllers/coupon.controller');

// Tạm thời không gài Token vào route create để ông dễ tạo data test
router.post('/create', createCoupon); 

// Yêu cầu user đăng nhập mới được dùng mã giảm giá
router.post('/apply', verifyToken, applyCoupon); 

module.exports = router;
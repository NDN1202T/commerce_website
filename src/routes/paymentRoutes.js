const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Lấy danh sách: GET http://localhost:3000/api/payments
router.get('/', paymentController.getAllPayments);

// Tạo mới: POST http://localhost:3000/api/payments
router.post('/', paymentController.createPayment);

// Cập nhật: PUT http://localhost:3000/api/payments/:id
router.put('/:id', paymentController.updatePayment);

// Xóa: DELETE http://localhost:3000/api/payments/:id
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
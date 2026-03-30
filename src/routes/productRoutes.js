const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Lấy danh sách: GET http://localhost:3000/api/products
router.get('/', productController.getAllProducts);

// Thêm mới: POST http://localhost:3000/api/products
router.post('/', upload.single('image'), productController.createProduct);

// Cập nhật: PUT http://localhost:3000/api/products/:id
router.put('/:id', upload.single('image'), productController.updateProduct);

// Xóa: DELETE http://localhost:3000/api/products/:id
router.delete('/:id', productController.deleteProduct);

module.exports = router;
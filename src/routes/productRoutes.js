const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Lấy danh sách: GET http://localhost:3000/api/products
router.get('/', productController.getAllProducts);

// Tìm kiếm sản phẩm: GET http://localhost:3000/api/products/search?keyword=abc
router.get('/search', productController.searchProduct);

// Thống kê sản phẩm: GET http://localhost:3000/api/products/stats
router.get('/stats', productController.getProductStats);

// Lấy sản phẩm theo danh mục: GET http://localhost:3000/api/products/category/:category
router.get('/category/:category', productController.getProductByCategory);

// Sắp xếp sản phẩm: GET http://localhost:3000/api/products/sort?sortBy=price&order=asc
router.get('/sort', productController.sortProducts);

// Thêm mới: POST http://localhost:3000/api/products
router.post('/', upload.single('image'), productController.createProduct);

// Cập nhật: PUT http://localhost:3000/api/products/:id
router.put('/:id', upload.single('image'), productController.updateProduct);

// Cập nhật tồn kho: PATCH http://localhost:3000/api/products/:id/stock
router.patch('/:id/stock', productController.updateStock);

// Xóa: DELETE http://localhost:3000/api/products/:id
router.delete('/:id', productController.deleteProduct);

module.exports = router;
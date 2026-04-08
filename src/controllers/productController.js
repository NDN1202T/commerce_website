const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// 1. Lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Thêm sản phẩm mới (Có xử lý ảnh null)
exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.file ? req.file.filename : null, // Nếu không có file thì để null
      category: req.body.category || 'Chưa phân loại',
      stock: req.body.stock || 0
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 3. Cập nhật sản phẩm (Có xử lý ảnh mới và xóa ảnh cũ)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    // Tìm sản phẩm cũ để kiểm tra ảnh
    const oldProduct = await Product.findById(id);
    if (!oldProduct) return res.status(404).json({ message: "Không thấy hàng!" });

    let updatedData = { name, price };

    // Nếu có file ảnh mới, cập nhật tên file và xóa ảnh cũ
    if (req.file) {
      updatedData.image = req.file.filename;

      // Xóa ảnh cũ trong thư mục uploads (nếu có) để đỡ rác máy
      if (oldProduct.image) {
        const oldImagePath = path.join(__dirname, '../../uploads', oldProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // 3. Cập nhật vào Database
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    // 1. Tìm sản phẩm trước khi xóa để lấy tên file ảnh
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa" });
    }

    // 2. Nếu sản phẩm có ảnh, tiến hành xóa file ảnh trong thư mục uploads
    if (product.image) {
      const imagePath = path.join(__dirname, '../../uploads', product.image);
      // Kiểm tra file có tồn tại không rồi mới xóa
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // 3. Xóa dữ liệu trong MongoDB
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Đã dọn dẹp sạch sẽ sản phẩm và ảnh liên quan!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 5. Tìm kiếm sản phẩm theo tên
exports.searchProduct = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm!' });
    }

    // Tìm sản phẩm có tên chứa từ khóa (không phân biệt hoa thường)
    const products = await Product.find({
      name: { $regex: keyword, $options: 'i' }
    });

    res.json({ count: products.length, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. Lấy sản phẩm theo danh mục
exports.getProductByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category });

    if (products.length === 0) {
      return res.status(404).json({ message: `Không tìm thấy sản phẩm nào trong danh mục "${category}"` });
    }

    res.json({ count: products.length, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 7. Thống kê sản phẩm
exports.getProductStats = async (req, res) => {
  try {
    // Tổng số sản phẩm
    const totalProducts = await Product.countDocuments();

    // Tổng giá trị tồn kho (price * stock)
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalStockValue: { $sum: { $multiply: ['$price', '$stock'] } },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' }
        }
      }
    ]);

    // Thống kê theo danh mục
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalProducts,
      inventory: inventoryValue[0] || {},
      categoryStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 8. Cập nhật số lượng tồn kho
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    // Kiểm tra stock có hợp lệ không
    if (stock === undefined || stock === null) {
      return res.status(400).json({ message: 'Vui lòng nhập số lượng tồn kho!' });
    }

    if (stock < 0) {
      return res.status(400).json({ message: 'Số lượng tồn kho không được âm!' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    }

    product.stock = stock;
    await product.save();

    res.json({ message: 'Cập nhật tồn kho thành công!', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 9. Sắp xếp sản phẩm theo giá hoặc tên
exports.sortProducts = async (req, res) => {
  try {
    const { sortBy, order } = req.query;

    // Chỉ cho phép sắp xếp theo 'name' hoặc 'price'
    const allowedFields = ['name', 'price'];
    if (!sortBy || !allowedFields.includes(sortBy)) {
      return res.status(400).json({
        message: `Vui lòng chọn trường sắp xếp hợp lệ: ${allowedFields.join(', ')}`
      });
    }

    // Xác định thứ tự: 'asc' (tăng dần) hoặc 'desc' (giảm dần), mặc định là 'asc'
    const sortOrder = order === 'desc' ? -1 : 1;

    const products = await Product.find().sort({ [sortBy]: sortOrder });

    res.json({ count: products.length, sortBy, order: sortOrder === 1 ? 'asc' : 'desc', products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
      image: req.file ? req.file.filename : null // Nếu không có file thì để null
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
const Category = require("../models/Category");

// 1. Lay ds Category
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "LLoi lay danh sach danh muc", error: error.message });
  }
};

// 2. Them Category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    await newCategory.save();
    
    res.status(201).json({ message: "Them danh muc thanh cong!", category: newCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Ten danh muc nay da ton tai!" });
    }
    res.status(500).json({ message: "Loi khi them danh muc", error: error.message });
  }
};

// 3. sua Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params; // Lay id tu URL
    
    // { new: true } đe tra ve doi tuong sau khi da cap nhat, thay vi doi tuong truoc khi cap nhat
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Khong tim thay danh muc can sua!" });
    }
    
    res.status(200).json({ message: "CCap nhat danh muc thanh cong!", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Loi khi cap nhat danh muc", error: error.message });
  }
};

// 4. delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: "Khong tim thay danh muc de xoa!" });
    }
    
    res.status(200).json({ message: "Da xoa danh muc thanh cong!" });
  } catch (error) {
    res.status(500).json({ message: "Loi khi xoa danh muc", error: error.message });
  }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
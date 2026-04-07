const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/", getAllCategories);

// Các API them sua xoa Category phai la admin moi duoc phep thao tac
router.use(verifyToken); 
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
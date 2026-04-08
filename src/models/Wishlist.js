const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Liên kết tới bảng User
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Liên kết tới bảng Product
      required: true,
    },
  },
  { timestamps: true }, // Tự động thêm createdAt và updatedAt
);

// Tạo index gộp để đảm bảo 1 user không thể thêm 1 sản phẩm 2 lần vào wishlist
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);

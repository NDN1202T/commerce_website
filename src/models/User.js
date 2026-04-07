const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Chuyển phone thành định danh chính
    phone: {
      type: String,
      required: true,
      unique: true, // Quan trọng: Để không có 2 tài khoản trùng SĐT
      trim: true,
    },
    email: {
      type: String,
      required: false, // Cho phép để trống nếu đăng ký bằng SĐT
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);

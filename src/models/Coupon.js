const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Ép chữ hoa (ví dụ: TET2026)
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"], // Giảm theo % hoặc Giảm số tiền cố định
      required: true,
    },
    discountValue: {
      type: Number,
      required: true, // Ví dụ: 10 (%) hoặc 50000 (VNĐ)
    },
    minOrderValue: {
      type: Number,
      default: 0, // Đơn hàng tối thiểu để được áp dụng
    },
    expirationDate: {
      type: Date,
      required: true, // Ngày hết hạn
    },
    usageLimit: {
      type: Number,
      required: true, // Số lần sử dụng tối đa (ví dụ: chỉ có 100 mã)
    },
    usedCount: {
      type: Number,
      default: 0, // Số lần đã được sử dụng (Ban đầu là 0)
    },
    isActive: {
      type: Boolean,
      default: true, // Trạng thái bật/tắt mã
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Coupon", couponSchema);

const Coupon = require("../models/Coupon");

// 1. TẠO MÃ GIẢM GIÁ (Dành cho Admin hoặc để ông tạo data test)
const createCoupon = async (req, res) => {
  try {
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res
      .status(201)
      .json({ message: "Tạo mã giảm giá thành công!", coupon: newCoupon });
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ message: "Mã code này đã tồn tại!" });
    res
      .status(500)
      .json({ message: "Lỗi tạo mã giảm giá", error: error.message });
  }
};

// 2. ÁP DỤNG MÃ GIẢM GIÁ (Dành cho User ở trang Cart)
const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body; // Cần mã code và tổng tiền hiện tại của giỏ hàng

    // Bước 1: Tìm mã code trong DB
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    // Bước 2: Dàn trận kiểm tra 5 lớp điều kiện
    if (!coupon)
      return res.status(404).json({ message: "Mã giảm giá không tồn tại!" });
    if (!coupon.isActive)
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã bị vô hiệu hóa!" });
    if (new Date() > coupon.expirationDate)
      return res.status(400).json({ message: "Mã giảm giá đã hết hạn!" });
    if (coupon.usedCount >= coupon.usageLimit)
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã hết lượt sử dụng!" });
    if (cartTotal < coupon.minOrderValue)
      return res
        .status(400)
        .json({
          message: `Đơn hàng phải từ ${coupon.minOrderValue}đ để áp dụng mã này!`,
        });

    // Bước 3: Tính toán tiền giảm
    let discountAmount = 0;
    if (coupon.discountType === "percent") {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }

    // Đảm bảo không giảm lố tổng tiền đơn hàng (VD: Đơn 50k mà mã giảm 100k thì chỉ trừ 50k thôi)
    if (discountAmount > cartTotal) discountAmount = cartTotal;

    const finalTotal = cartTotal - discountAmount;

    // Bước 4: Trả kết quả về cho Frontend
    res.status(200).json({
      message: "Áp dụng mã thành công!",
      discountAmount: discountAmount,
      finalTotal: finalTotal,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi áp dụng mã", error: error.message });
  }
};

module.exports = { createCoupon, applyCoupon };

const Wishlist = require("../models/Wishlist");

// 1. Lấy danh sách yêu thích của User đang đăng nhập
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ auth.middleware
    // Tìm kiếm và "populate" (lấy thêm chi tiết) thông tin sản phẩm
    const wishlist = await Wishlist.find({ userId }).populate("productId");

    res.status(200).json(wishlist);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy danh sách yêu thích", error });
  }
};

// 2. Thêm sản phẩm vào danh sách yêu thích
const addToWishlist = async (req, res) => {
  try {
    // const userId = req.user.id;
    const userId = "65abcdef1234567890abcdef";
    const { productId } = req.body;

    // Do Model đã set unique index, nếu thêm trùng sẽ tự văng lỗi catch
    const newWishlistItem = new Wishlist({ userId, productId });
    await newWishlistItem.save();

    res.status(201).json({
      message: "Đã thêm vào danh sách yêu thích",
      data: newWishlistItem,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Sản phẩm đã có trong danh sách yêu thích!" });
    }
    console.log("CHI TIẾT LỖI:", error); // Thêm dòng này để in lỗi ra terminal
    res
      .status(500)
      .json({ message: "Lỗi khi thêm sản phẩm", error: error.message }); // Đổi error thành error.message
  }
};

// 3. Xóa sản phẩm khỏi danh sách yêu thích
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params; // Lấy từ URL (vd: /api/wishlist/123)

    const deletedItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!deletedItem) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong wishlist" });
    }

    res.status(200).json({ message: "Đã xóa khỏi danh sách yêu thích" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };

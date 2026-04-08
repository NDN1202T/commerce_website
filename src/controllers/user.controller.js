const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 1. LẤY THÔNG TIN HỒ SƠ (Profile)
const getProfile = async (req, res) => {
  try {
    // Tìm user theo ID từ Token (loại bỏ trường password để bảo mật)
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy thông tin hồ sơ", error: error.message });
  }
};

// 2. CẬP NHẬT HỒ SƠ (Cập nhật tên, email, ảnh, địa chỉ)
const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar, address } = req.body;

    // Tìm và cập nhật user. { new: true } để DB trả về cục data mới nhất sau khi sửa
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, avatar, address },
      { new: true, runValidators: true },
    ).select("-password");

    res
      .status(200)
      .json({ message: "Cập nhật hồ sơ thành công!", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi cập nhật hồ sơ", error: error.message });
  }
};

// 3. ĐỔI MẬT KHẨU (Đòi hỏi mật khẩu cũ)
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Lấy user ra (cần lấy cả password để so sánh)
    const user = await User.findById(req.user.id);

    // Kiểm tra mật khẩu cũ có khớp không
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác!" });
    }

    // Nếu mật khẩu mới trùng mật khẩu cũ thì báo lỗi
    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải khác mật khẩu cũ!" });
    }

    // Mã hóa mật khẩu mới và lưu lại
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi đổi mật khẩu", error: error.message });
  }
};

// 4. Lay ds User tru thang Admin
const getAllUsersExceptAdmin = async (req, res) => {
  try {
    // Tim tat ca user ma khong phai admin, va bo tru truong password de bao mat
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Loi lay danh sach nguoi dung", error: error.message });
  }
};

// 5. Delete User (Admin moi duoc xoa)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // lay ID tu URL
    
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Khong tim thay nguoi dung nay!" });
    }

    res.status(200).json({ message: "Xoa nguoi dung thanh cong!" });
  } catch (error) {
    res.status(500).json({ message: "Loi khi xoa", error: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword, getAllUsersExceptAdmin, deleteUser };

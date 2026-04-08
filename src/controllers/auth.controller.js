const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, phone, password, email } = req.body;

    // Kiểm tra xem SĐT đã tồn tại chưa
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Số điện thoại này đã được đăng ký!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      phone,
      password: hashedPassword,
      email: email || "", // Email có thể có hoặc không
    });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký tài khoản thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi đăng ký", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body; // Nhận phone thay vì email

    // 1. Tìm user theo số điện thoại
    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Số điện thoại hoặc mật khẩu không đúng!" });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Số điện thoại hoặc mật khẩu không đúng!" });
    }

    // 3. Tạo Token
    const secretKey = process.env.JWT_SECRET || "chuoi_bi_mat_test";
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi đăng nhập", error: error.message });
  }
};

module.exports = { register, login };

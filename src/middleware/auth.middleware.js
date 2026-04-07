const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Lấy token từ header do axiosClient của FE gửi lên
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Tách chữ "Bearer" lấy phần token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Vui lòng đăng nhập để thực hiện chức năng này!" });
  }

  try {
    // Giải mã token (nhớ đảm bảo process.env.JWT_SECRET khớp với lúc tạo token khi login)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn thông tin user vào request để các hàm phía sau dùng được
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

module.exports = { verifyToken };

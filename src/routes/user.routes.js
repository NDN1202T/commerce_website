const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/user.controller");

// Tất cả API của User đều cần phải đăng nhập (có Token)
router.use(verifyToken);

router.get("/profile", getProfile); // GET /api/users/profile
router.put("/profile", updateProfile); // PUT /api/users/profile
router.put("/change-password", changePassword); // PUT /api/users/change-password

module.exports = router;

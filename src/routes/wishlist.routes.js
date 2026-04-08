const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlist.controller");

// Đặt middleware verifyToken lên trước để bảo vệ toàn bộ API bên dưới
router.use(verifyToken);

router.get("/", getWishlist); // GET /api/wishlist
router.post("/", addToWishlist); // POST /api/wishlist
router.delete("/:productId", removeFromWishlist); // DELETE /api/wishlist/:productId

module.exports = router;

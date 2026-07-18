const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  register,
  login,
  adminLogin,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getMe);

module.exports = router;
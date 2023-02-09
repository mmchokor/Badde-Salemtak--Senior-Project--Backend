const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getUserInfo,
	forgotPassword,
	resetPassword,
	updateMe,
	updatePassword,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

// Routes for user
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserInfo);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateMe", protect, updateMe);
router.patch("/updateMyPassword", protect, updatePassword);

module.exports = router;

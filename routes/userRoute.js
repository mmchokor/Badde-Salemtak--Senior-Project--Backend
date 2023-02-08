const express = require("express");
const router = express.Router();
const {
	registerUser,
	loginUser,
	getUserInfo,
	forgotPassword,
	resetPassword,
} = require("../controllers/userController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserInfo);
//we can change the route name later on
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
module.exports = router;

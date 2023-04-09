const express = require("express");

const router = express.Router();

const {
	getNotificationByUser,
	deleteNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getNotificationByUser);
router.delete("/:id", protect, deleteNotification);

module.exports = router;

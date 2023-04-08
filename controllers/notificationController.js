const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// const Order = require("../models/orderModel");

// @desc    get notification for user
// @route   get /api/notification/
// @access  Private

const getNotificationByUser = asyncHandler(async (req, res) => {
	const userNotifications = await Notification.find({ user: req.user.id });
	if (!userNotifications) {
		res.status(404);
		throw new Error("No Notfications found");
	}

	res.status(200).json({
		status: "success",
		results: userNotifications.length,
		data: {
			userNotifications,
		},
	});
});

// @desc    delete notification
// @route   delete /api/notification/:id
// @access  Private

const deleteNotification = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}
	const notification = await Notification.findById(req.params.id);

	if (!notification) {
		res.status(404);
		throw new Error("Notification not found");
	}

	const removeNotification = await notification.remove();

	if (!removeNotification) {
		res.status(400);
		throw new Error("Notification not removed");
	}

	res.status(200).json({ success: true });
});

module.exports = {
	getNotificationByUser,
	deleteNotification,
};

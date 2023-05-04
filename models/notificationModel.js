const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	message: {
		type: String,
	},
	date: {
		type: Date,
	},
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Orders",
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("Notifications", NotificationSchema);

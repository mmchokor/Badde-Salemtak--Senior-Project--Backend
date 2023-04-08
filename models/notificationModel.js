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
});

module.exports = mongoose.model("Notifications", NotificationSchema);

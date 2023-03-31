const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
	listing: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "residentListing",
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	serviceFee: {
		type: Number,
		default: 5,
	},
	deliveryFee: {
		type: Number,
		default: 0,
	},
	date: {
		type: Date,
		required: [true, "Please select a date"],
	},
	message: {
		type: String,
		maxlength: [300, "The message must be less than 300 characters"],
	},
});

module.exports = mongoose.model("Orders", OrderSchema);

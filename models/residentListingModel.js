const mongoose = require("mongoose");
// const validator = require('validator');
const Schema = mongoose.Schema;

const ResidentListingSchema = new Schema({
	name: {
		type: String,
		required: [true, "A product must have a name"],
		trim: true,
		maxlength: [70, "The product's name must be less than 70 characters"],
	},
	description: {
		type: String,
		trim: true,
		maxlength: [800, "The number of characters should be less than 800"],
	},
	imageCover: {
		type: String,
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	cityOfResidence: {
		type: String,
	},
	approximateWeight: {
		type: Number,
		required: [true, "Please specify the approximate weightof the product"],
	},
	quantity: {
		type: Number,
		required: [true, "Please specify the quantity of the product"],
	},
	price: {
		type: Number,
		required: [true, "Please enter estimated price"],
	},
	paymentMethod: {
		type: String,
		required: [true, "Please specify the payment method"],
		enum: ["Cash", "MoneyTransfer", "BankTransfer"],
	},
	productType: {
		type: String,
		required: [true, "Please specify the product type"],
		enum: [
			"Accessories",
			"Medicine",
			"Food",
			"Electronics",
			"Clothes",
			"Others",
		],
	}
});

module.exports = ResidentListing = mongoose.model(
	"residentListing",
	ResidentListingSchema
);

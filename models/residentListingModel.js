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
		required: [true, "A product must have an image"],
	},
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
	},
	price: {
		type: Number,
		required: [true, "Please enter estimated price"],
	},
});

module.exports = ResidentListing = mongoose.model(
	"residentListing",
	ResidentListingSchema
);

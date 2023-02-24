const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	residentListing: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "residentListing",
		required: true,
	},
});

const Favorites = mongoose.model("Favorites", favoritesSchema);

module.exports = Favorites;

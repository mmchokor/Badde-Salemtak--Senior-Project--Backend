const mongoose = require("mongoose");

const favoritesSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	listing: {
		type: mongoose.Schema.Types.ObjectId,
		refPath: "listingType",
		required: true,
	},
	listingType: {
		type: String,
		enum: ["residentListing", "traverlerListing"],
		required: true,
	},
	timestamp: { type: Date, default: Date.now },
});

const Favorites = mongoose.model("Favorites", favoritesSchema);

module.exports = Favorites;

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
	timestamp: { type: Date, default: Date.now() },
});
//To prevent any duplicate values in the favorite database
favoritesSchema.index({ user: 1, listing: 1 }, { unique: true });

const Favorites = mongoose.model("Favorites", favoritesSchema);

module.exports = Favorites;

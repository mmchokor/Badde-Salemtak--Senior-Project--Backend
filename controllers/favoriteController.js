const asyncHandler = require("express-async-handler");
const Favorites = require("../models/favoriteModel");
const User = require("../models/userModel");

// @desc    create favorite resident listings
// @route   post /api/favorite/
// @access  Private
const createFavorite = asyncHandler(async (req, res) => {
	const { user, residentListing } = req.body;
	if (!user || !residentListing) {
		res.status(400);
		throw new Error("Please fill all fields");
	}

	const favorite = await Favorites.create({
		user,
		residentListing,
	});
	res.status(201).json({
		status: "success",
		data: {
			favorite,
		},
	});
});

// @desc    get favorites resident listings
// @route   get /api/favorite/users/:userId
// @access  Private
const getFavoritesByUser = asyncHandler(async (req, res) => {
	const favorite = await Favorites.find({
		user: req.params.userId,
	});
	res.status(200).json({
		status: "success",
		data: {
			favorite,
		},
	});
});

// @desc    delete specific favorite resident listings
// @route   delete /api/favorite/:id
// @access  Private
const deleteFavorite = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}
	const favorite = await Favorites.findById(req.params.id);

	if (!favorite) {
		res.status(404);
		throw new Error("Favorite listing not found");
	}
	if (favorite.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error("Not Authorized");
	}
	await favorite.remove();

	res.status(200).json({ success: true });
});

module.exports = {
	deleteFavorite,
	createFavorite,
	getFavoritesByUser,
};

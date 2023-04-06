const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const ResidentListing = require("../models/residentListingModel");
const User = require("../models/userModel");

// @desc    create order by user for resident listing
// @route   post /api/order/
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
	const { listing, serviceFee, deliveryFee, date, message } = req.body;

	const residentListing = await ResidentListing.findById(listing);

	if (!residentListing) {
		res.status(404);
		throw new Error("No listing was found!");
	}

	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}

	if (!listing || !serviceFee || !deliveryFee || !date) {
		res.status(400);
		throw new Error("Fill all fields.");
	}

	const order = await Order.create({
		listing,
		user: req.user.id,
		serviceFee,
		deliveryFee,
		date,
		message,
	});
	res.status(201).json({
		status: "success",
		data: {
			order,
		},
	});
});

// @desc    get orders by resident listings
// @route   get /api/order/listing/:listingId
// @access  Private

const getOrdersByListing = asyncHandler(async (req, res) => {
	const listingOrders = await Order.findOne({
		listing: req.params.listingId,
	}).populate({
		path: "listing",
		select: "name user",
	});
	console.log(listingOrders.listing.name, listingOrders.listing.user);

	if (!listingOrders) {
		res.status(404);
		throw new Error("No order for this listing found");
	}
	res.status(200).json({
		status: "success",
		results: listingOrders.length,
		data: {
			listingOrders,
		},
	});
});

module.exports = {
	createOrder,
	getOrdersByListing,
};

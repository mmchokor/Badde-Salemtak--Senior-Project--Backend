const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const ResidentListing = require("../models/residentListingModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");

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

	const notificationForUser = await ResidentListing.findById(listing).populate(
		"user"
	);

	const notification = await Notification.create({
		user: notificationForUser.user._id,
		sender: req.user.id,
		message: `This sender ${req.user.firstname}  ${req.user.lastname} has sent you an order for this listing ${notificationForUser.name} `,
		date: Date.now(),
		order,
	});
	console.log("Notfication sent to the listing owner");

	res.status(201).json({
		status: "success",
		data: {
			order,
		},
	});
});

// @desc    accept order sent by  user to the listing owner
// @route   patch /api/order/:orderId
// @access  Private
const acceptOrder = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}

	const order = await Order.findById(req.params.orderId);

	if (!order) {
		res.status(404);
		throw new Error("Order not Found");
	}

	const acceptedOrder = await Order.findByIdAndUpdate(
		req.params.orderId,
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);
	// console.log(acceptedOrder);

	const notification = await Notification.create({
		user: order.user,
		sender: req.user.id,
		message: `The resident ${req.user.firstname} ${req.user.lastname} have accepted you offer and payed for the item. Its time for you to deliver it!!!`,
		date: Date.now(),
		order: acceptedOrder,
	});
	console.log("Notification sent to the Traveller now");

	res.status(200).json({
		status: "success",
		data: {
			notification,
		},
	});
});

// @desc    get orders by resident listings
// @route   get /api/order/listing/:listingId
// @access  Private
const getOrdersByListing = asyncHandler(async (req, res) => {
	const listingOrders = await Order.find({
		listing: req.params.listingId,
	}).populate({
		path: "listing",
		select: "name user",
	});

	//console.log(listingOrders.listing.name, listingOrders.listing.user);

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

// @desc    get order by id
// @route   get /api/order/:orderId
// @access  Private

const getOrderById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}

	const order = await Order.findById(req.params.orderId);

	if (!order) {
		res.status(404);
		throw new Error("Order not found");
	}
	res.status(200).json({
		status: "success",
		data: {
			order,
		},
	});
});

module.exports = {
	createOrder,
	acceptOrder,
	getOrdersByListing,
	getOrderById,
};

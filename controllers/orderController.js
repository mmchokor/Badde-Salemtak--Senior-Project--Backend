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
// @route   patch /api/order/:orderId/accepted
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

// @desc    confirm order delivered by traveller to resident
// @route   get /api/order/:orderId/delivered
// @access  Private

const deliveredOrder = asyncHandler(async (req, res) => {
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

	const OrderDelivered = await Order.findByIdAndUpdate(
		req.params.orderId,
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);

	const notification = await Notification.create({
		user: order.user,
		sender: req.user.id,
		message: `The resident ${req.user.firstname} ${req.user.lastname} have confirmed the delivery. The money is sent to you!`,
		date: Date.now(),
		order: OrderDelivered,
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

// @desc    get accepted orders for user
// @route   get /api/order/me/resident
// @access  Private

// this is for the accepted orders screen for the resident living in lebanon to see the orders he just accepted and waiting for it to be delivereed
const getAcceptedOrdersByUser = asyncHandler(async (req, res) => {
	const userId = await User.findById(req.user.id);

	const orders = await Order.find({ status: "accepted" })
		.populate({
			path: "listing",
			populate: { path: "user", select: "firstname" },
		})
		.populate({ path: "user", select: "firstname lastname" })
		.exec();

	if (!orders) {
		res.status(404);
		throw new Error("Orders not found");
	}

	const acceptedOrders = orders.filter(
		order => order.listing.user._id.toString() === userId._id.toString()
	);

	res.status(200).json({
		status: "success",
		results: acceptedOrders.length,
		data: {
			acceptedOrders,
		},
	});
});

// @desc    get order by id
// @route   get /api/order/me/traveller
// @access  Private
const getPendingDeliveryForTraveller = asyncHandler(async (req, res) => {
	const userId = await User.findById(req.user.id);
	const orders = await Order.find({ user: userId })
		.populate({
			path: "listing",
			populate: { path: "user", select: "firstname" },
		})
		// .populate({ path: "user", select: "firstname lastname" })
		.exec();

	if (orders.length > 0) {
		const pendingOrders = orders.filter(order => order.status === "accepted");

		res.status(200).json({
			status: "success",
			results: pendingOrders.length,
			data: {
				pendingOrders,
			},
		});
	} else {
		res.status(200).json({
			status: "success",
			message: "There are no orders pending to be delivered by you",
		});
	}
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
	deliveredOrder,
	getOrdersByListing,
	getAcceptedOrdersByUser,
	getPendingDeliveryForTraveller,
	getOrderById,
};

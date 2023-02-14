const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const ResidentListing = require("../models/residentListingModel");
const APIFeatures = require("../utils/apiFeatures");

const getRListings = asyncHandler(async (req, res) => {
	const features = new APIFeatures(ResidentListing.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const residentListings = await features.query;

	res.status(200).json({
		status: "success",
		results: residentListings.length,
		data: {
			residentListings,
		},
	});
});

const getRListing = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}

	const residentListing = await ResidentListing.findById(req.params.id);

	if (!residentListing) {
		res.status(404);
		throw new Error("Resident Listing not found");
	}
	res.status(200).json({
		status: "success",
		data: {
			residentListing,
		},
	});
});

const deleteRListing = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}
	const residentListing = await ResidentListing.findById(req.params.id);

	if (!residentListing) {
		res.status(404);
		throw new Error("Resident listing not found");
	}

	if (residentListing.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error("Not Authorized");
	}

	await residentListing.remove();

	res.status(200).json({ success: true });
});

const updateRListing = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}

	const residentListing = await ResidentListing.findById(req.params.id);

	if (!residentListing) {
		res.status(404);
		throw new Error("Resident Listing not found");
	}
	if (residentListing.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error("Not Authorized");
	}
	const updatedResidentListing = await ResidentListing.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true }
	);
	res.status(200).json({
		status: "success",
		data: { updatedResidentListing },
	});
});

const createRListing = asyncHandler(async (req, res) => {
	const {
		name,
		description,
		cityOfResidence,
		imageCover,
		approximateWeight,
		productType,
		price,
	} = req.body;
	if (
		!name ||
		!description ||
		!cityOfResidence ||
		!imageCover ||
		!approximateWeight ||
		!productType ||
		!price
	) {
		res.status(400);
		throw new Error("Please fill all fields");
	}
	const user = await User.findById(req.user.id);

	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}
	const residentListing = await ResidentListing.create({
		name,
		description,
		cityOfResidence,
		imageCover,
		approximateWeight,
		productType,
		price,
		user: req.user.id,
	});
	res.status(201).json({
		status: "success",
		data: {
			residentListing,
		},
	});
});

module.exports = {
	getRListings,
	getRListing,
	createRListing,
	deleteRListing,
	updateRListing,
};

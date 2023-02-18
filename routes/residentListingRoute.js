const express = require("express");

const router = express.Router();

const {
	getRListings,
	getRListing,
	createRListing,
	deleteRListing,
	updateRListing,
} = require("../controllers/residentListingController");

const { protect } = require("../middlewares/authMiddleware");

// all listings
router.route("/").get(protect, getRListings).post(protect, createRListing);

router
	.route("/:id")
	.get(protect, getRListing)
	.delete(protect, deleteRListing)
	.patch(protect, updateRListing);

module.exports = router;

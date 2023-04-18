const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = express.Router();

const {
	getRListings,
	getRListing,
	createRListing,
	deleteRListing,
	updateRListing,
	getUserRListing
} = require("../controllers/residentListingController");

const { protect } = require("../middlewares/authMiddleware");

// all listings
router.route("/").get(protect, getRListings).post(protect, upload.array('images', 5), createRListing);

router
	.route("/:id")
	.get(protect, getRListing)
	.delete(protect, deleteRListing)
	.patch(protect, updateRListing);

router.route("/user/:id").get(protect, getUserRListing)

module.exports = router;

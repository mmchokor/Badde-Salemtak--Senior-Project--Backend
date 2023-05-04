const express = require("express");

const router = express.Router();

const orderController = require("../controllers/orderController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, orderController.createOrder);
router.patch("/:orderId", protect, orderController.acceptOrder);
router.get("/:orderId", protect, orderController.getOrderById);
router.get("/listing/:listingId", protect, orderController.getOrdersByListing);

module.exports = router;

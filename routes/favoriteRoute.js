const express = require("express");

const router = express.Router();

const {
	createFavorite,
	getFavoritesByUser,
	deleteFavorite,
} = require("../controllers/favoriteController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, createFavorite);
router.get("/users/:userId", protect, getFavoritesByUser);
router.delete("/:id", protect, deleteFavorite);

module.exports = router;

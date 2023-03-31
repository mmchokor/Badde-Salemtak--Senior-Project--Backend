const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Welcome message to our API
app.get("/", (req, res) => {
	res.status(200).json({ message: "Welcome to Badde Salemtak API Service" });
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/traveler", require("./routes/travelerListingRoute"));
app.use("/api/resident", require("./routes/residentListingRoute"));
app.use("/api/favorite", require("./routes/favoriteRoute"));
app.use("/api/order", require("./routes/orderRoute"));

app.all("*", (req, res) => {
	res.status(404).json({ message: "API not found" });
	throw new Error(`Can't find ${req.originalUrl} on this server!`);
});

app.use(errorHandler);

module.exports = app;

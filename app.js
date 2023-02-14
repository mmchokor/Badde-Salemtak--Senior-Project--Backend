const express = require("express");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

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

app.use(errorHandler);

module.exports = app;

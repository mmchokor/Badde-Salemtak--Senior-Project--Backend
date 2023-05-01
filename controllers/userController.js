const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const residentListing = require("../models/residentListingModel");
const travelerListing = require("../models/traverlerListingModel");
const Order = require("../models/orderModel");
const Notification = require("../models/notificationModel");
const Favorites = require("../models/favoriteModel");

// @desc    Registera new user
// @route   /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
   const { firstname, lastname, email, password, phone, country, admin } =
      req.body

	// validation
	if (!firstname || !lastname || !email || !password || !phone || !country) {
		res.status(400);
		throw new Error("Please include all fields");
	}

	// Find if user already exists
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	// Hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

   // create user
   const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      country,
      admin,
   })

   if (user) {
      res.status(201).json({
         _id: user._id,
         firstname: user.firstname,
         lastname: user.lastname,
         email: user.email,
         phone: user.phone,
         country: user.country,
         admin: user.admin,
         token: generateToken(user._id),
      })
   } else {
      res.status(400)
      throw new Error('Invalid User data')
   }
})

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	// Check user and password match
	if (user && (await bcrypt.compare(password, user.password))) {
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("Invalid Credentials");
	}
});

// @desc    Get current user
// @route   /api/users/me
// @access  Private
const getUserInfo = asyncHandler(async (req, res) => {
	const user = {
		id: req.user._id,
		email: req.user.email,
		firstname: req.user.firstname,
		lastname: req.user.lastname,
		phone: req.user.phone,
		country: req.user.country,
	};
	res.status(200).json(user);
});

// @desc    Get User Info By Id
// @route   /api/users/:id
// @access  Private

const getUserInfoById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		res.status(401);
		throw new Error("User not found");
	}
	res.status(200).json({
		status: "success",
		data: {
			id: user._id,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			country: user.country,
			createdAt: user.createdAt,
		},
	});
});
// @desc    function that sends a reset token to the user's email
// @route   /api/users/forgotPassword
// @access  Private
const forgotPassword = asyncHandler(async (req, res, next) => {
	//He should add his email first
	const user = await User.findOne({ email: req.body.email });
	//then we should generate him a random reset token for a period of
	// time to be able to change his password
	if (user) {
		const resetToken = user.createPasswordResetToken();
		// we created .createPasswordResetToken() in the model to use userschema and this in the function
		await user.save({ validateBeforeSave: false });

		//now we should send it to the user's email

      const resetURL =
         process.env.BACKEND_DOMAIN + `/api/users/resetPassword/${resetToken}`

		//the resetPassword is another function implemented under this one

		//now we generate a message for the user to be sent
		const message = `Forgot your password? Submit a Patch request  with you new password and passwordConfirm to this ${resetURL}.\n If you didn't forgot your password please ignore this email.`;
		try {
			await sendEmail({
				email: user.email,
				subject: "Your password reset valid for 10 mins only",
				message,
			});
			res.status(200).json({
				status: "success",
				message: "Token sent to email!",
			});
		} catch (err) {
			// we delete them if any error happened
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save({ validateBeforeSave: false });

			//Now we send the res message in case of error
			//Internal error
			res.status(500).json({
				status: "fail",
				message: "There was an error sending the email.",
			});
		}
	} else {
		res.status(404).json({
			status: "fail",
			message: "There is no user with that email address.",
		});
	}
});

// @desc    function that resets the password
// @route   /api/users/resetPassword/:token
// @access  Private
const resetPassword = asyncHandler(async (req, res, next) => {
	// ok now we recieve the token already from the req
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	//after encrypting the token we search for the same hashedtoken saved
	//in a user in our DB
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	//if the user was found and time is still less than 10 mins then it will work
	if (!user) {
		res.status(400).json({
			status: "fail",
			message: "Token is invalid or has expired.",
		});
	} else {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		user.password = hashedPassword;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();

		this.passwordChangedAt = Date.now() - 1000;

		const token = generateToken(user._id);

		res.status(200).json({
			status: "success",
			token,
			data: {
				user,
			},
		});
	}
});

// @desc    Update user info
// @route   /api/users/updateMe
// @access  Private
const updateMe = asyncHandler(async (req, res, next) => {
	if (!req.body.password) {
		const filtering = filterObj(
			req.body,
			"firstname",
			"lastname",
			"email",
			"phone",
			"country"
		);
		const updatedUser = await User.findByIdAndUpdate(req.user.id, filtering, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "success",
			data: {
				user: updatedUser,
			},
		});
	} else {
		res.status(400);
		throw new Error("This route is not for password updates");
	}
});

// @desc    Update user password
// @route   /api/users/updatePassword
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");
	if (await bcrypt.compare(req.body.passwordCurrent, user.password)) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		user.password = hashedPassword;
		await user.save();
		res.status(200).json({
			status: "success",
			data: {
				user,
			},
		});
	} else {
		throw new Error("Your current password is wrong!");
	}
});

// @desc    delete user using user id from params
// @route   /api/users/
// @access  Private
const deleteUser = asyncHandler(async (req, res, next) => {
   const userReq = await User.findById(req.user.id)

   if (!userReq.admin) {
      res.status(401).send({ message: 'Not admin' })
   }
   const { id } = req.params

   try {
      const user = await User.findById(id)

      if (!user) {
         return res.status(404).send({ error: 'User not found' })
      }

	  // Delete all the listings of the user
	  const residentListings = await residentListing.find({ user: user._id })
      const travelerListings = await travelerListing.find({ user: user._id })
	  for (const userListing of [...residentListings, ...travelerListings]) {
		await Order.deleteMany({ listing: userListing._id })
		await Favorites.deleteMany({ listing: userListing._id })
	 }
	  await residentListing.deleteMany({ user: user._id })
	  await travelerListing.deleteMany({ user: user._id })
	  await Order.deleteMany({ user: user._id })
	  await Favorites.deleteMany({ user: user._id })
	  await Notification.deleteMany({ user: user._id })

      user.remove()

      res.send({ message: 'User deleted successfully' })
   } catch (error) {
      res.status(500).send({ error: 'Something went wrong' })
   }
})

// Helper functions
// this is a filteredObject in order to prevent the user from changing restricted fields
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) {
			newObj[el] = obj[el];
		}
	});
	return newObj;
};

// Generate token
const generateToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
};

module.exports = {
   registerUser,
   loginUser,
   getUserInfo,
   forgotPassword,
   resetPassword,
   updateMe,
   updatePassword,
   deleteUser,
	 getUserInfoById,
}

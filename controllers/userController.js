const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

// @desc    Registera new user
// @route   /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
   const { firstname, lastname, email, password, phone, country } = req.body

   // validation
   if (!firstname || !lastname || !email || !password || !phone || !country) {
      res.status(400)
      throw new Error('Please include all fields')
   }

   // Find if user already exists
   const userExists = await User.findOne({ email })

   if (userExists) {
      res.status(400)
      throw new Error('User already exists')
   }

   // Hash password
   const salt = await bcrypt.genSalt(10)
   const hashedPassword = await bcrypt.hash(password, salt)

   // create user
   const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      country,
   })

   if (user) {
      res.status(201).json({
         _id: user._id,
         firstname: user.firstname,
         lastname: user.lastname,
         email: user.email,
         phone: user.phone,
         country: user.country,
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
   const { email, password } = req.body

   const user = await User.findOne({ email })

   // Check user and password match
   if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
         _id: user._id,
         name: user.name,
         email: user.email,
         token: generateToken(user._id),
      })
   } else {
      res.status(401)
      throw new Error('Invalid Credentials')
   }
})

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
   }
   res.status(200).json(user)
})

// Generate token
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
   })
}

module.exports = {
   registerUser,
   loginUser,
   getUserInfo,
}

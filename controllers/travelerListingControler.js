const asyncHandler = require('express-async-handler')
const APIFeatures = require('../utils/apiFeatures')
const User = require('../models/userModel')
const TraverlerListing = require('../models/traverlerListingModel')

// @desc    Get all traveler listings
// @route   GET /api/traveler/listing
// @access  Private
const getAllListings = asyncHandler(async (req, res) => {
   const page = req.query.page || 1
   const limit = req.query.limit || 100
   const features = new APIFeatures(
      TraverlerListing.find().populate('user', 'firstname lastname _id'),
      req.query
   )
      .filter()
      .sort()
      .limitFields()
      .paginate(page, limit)
   const travelerListings = await features.query

   res.status(200).json(travelerListings)
})

// @desc    Get user singular listing
// @route   GET /api/traveler/listing/:id
// @access  Private
const getListing = asyncHandler(async (req, res) => {
   // Get user using the id in the jwt
   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }

   const travelerListing = await TraverlerListing.findById(
      req.params.id
   ).populate('user', 'firstname lastname _id')

   if (!travelerListing) {
      res.status(404)
      throw new Error('Traveler Listing not found')
   }

   res.status(200).json(travelerListing)
})

// @desc    Delete a traveler listing
// @route   DELETE /api/traveler/listing/:id
// @access  Private
const deleteListing = asyncHandler(async (req, res) => {
   // Get user using the id in the jwt
   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }

   const travelerListing = await TraverlerListing.findById(req.params.id)

   if (!travelerListing) {
      res.status(404)
      throw new Error('Traveler listing not found')
   }

   if (residentListing.user.toString() !== req.user.id && !req.user.admin) {
      res.status(401)
      throw new Error('Not Authorized')
   }

   await travelerListing.remove()

   res.status(200).json({ success: true })
})

// @desc    Update traveler listing
// @route   PUT /api/traveler/listing/:id
// @access  Private
const updateListing = asyncHandler(async (req, res) => {
   // Get user using the id in the jwt
   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }

   const travelerListing = await TraverlerListing.findById(req.params.id)

   if (!travelerListing) {
      res.status(404)
      throw new Error('Traveler listing not found')
   }

   if (residentListing.user.toString() !== req.user.id && !req.user.admin) {
      res.status(401)
      throw new Error('Not Authorized')
   }

   const updatedTravelerListing = await TraverlerListing.findByIdAndUpdate(
      req.params.id,
      req.body
   )

   res.status(200).json(updatedTravelerListing)
})

// @desc    Create new traveler listing
// @route   POST /api/traveler/listing/
// @access  Private
const createListing = asyncHandler(async (req, res) => {
   const {
      extraWeight,
      date,
      dimension,
      ticketNumber,
      residentCity,
      description,
      country,
      paymentMethod,
      productType,
   } = req.body

   if (
      !extraWeight ||
      !date ||
      !dimension ||
      !ticketNumber ||
      !residentCity ||
      !description ||
      !country ||
      !paymentMethod ||
      !productType
   ) {
      res.status(400)
      console.log(req.body)
      throw new Error('Missing Fields')
   }

   // Get user using the id in the jwt
   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }

   const travelerListing = await TraverlerListing.create({
      extraWeight,
      date,
      dimension,
      ticketNumber,
      residentCity,
      description,
      country,
      paymentMethod,
      productType,
      user: req.user.id,
   })

   res.status(201).json(travelerListing)
})

module.exports = {
   getAllListings,
   getListing,
   createListing,
   deleteListing,
   updateListing,
}

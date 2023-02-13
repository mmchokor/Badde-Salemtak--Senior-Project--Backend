const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const TraverlerListing = require('../models/traverlerListingModel')

// @desc    Get traveler listings
// @route   GET /api/traveler/listing
// @access  Private
const getListings = asyncHandler(async (req, res) => {
   // Get user using the id in the jwt
   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }

   const travelerListings = await TraverlerListing.find({ user: req.user.id })

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

   const travelerListing = await TraverlerListing.findById(req.params.id)

   if (!travelerListing) {
      res.status(404)
      throw new Error('Traveler Listing not found')
   }

   if (travelerListing.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('Not Authorized')
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

   if (travelerListing.user.toString() !== req.user.id) {
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

   if (travelerListing.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('Not Authorized')
   }

   const updatedTravelerListing = await TraverlerListing.findByIdAndUpdate(
      req.params.id,
      req.body,
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
   } = req.body

   if (
      !extraWeight ||
      !date ||
      !dimension ||
      !ticketNumber ||
      !residentCity ||
      !description ||
      !country
   ) {
      res.status(400)
      console.log(req.body)
      throw new Error('Please add a product and description')
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
      user: req.user.id,
   })

   res.status(201).json(travelerListing)
})

module.exports = {
   getListings,
   getListing,
   createListing,
   deleteListing,
   updateListing,
}

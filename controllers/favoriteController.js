const asyncHandler = require('express-async-handler')
const Favorites = require('../models/favoriteModel')
const User = require('../models/userModel')

// @desc    create favorite resident listings
// @route   post /api/favorite/
// @access  Private
const createFavorite = asyncHandler(async (req, res) => {
   const { user, listing, listingType } = req.body
   console.log(req.body)
   if (!user || !listing || !listingType) {
      res.status(400)
      throw new Error('The request is missing required parameters')
   }

   const favorite = await Favorites.create({
      user,
      listing,
      listingType,
   })
   res.status(201).json({
      status: 'success',
      data: {
         favorite,
      },
   })
})

// @desc    get favorites resident listings
// @route   get /api/favorite/users/:userId
// @access  Private
const getFavoritesByUser = asyncHandler(async (req, res) => {
   const favoriteListings = await Favorites.find({
      user: req.params.userId,
   }).populate({
      path: 'listing',
   })

   if (!favoriteListings) {
      res.status(404)
      throw new Error('No favorite listings found')
   }

   res.status(200).json({
      status: 'success',
      data: {
         favorite: favoriteListings,
      },
   })
})

// @desc    delete specific favorite resident listings
// @route   delete /api/favorite/:id
// @access  Private
const deleteFavorite = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }
   const favorite = await Favorites.findById(req.params.id)

   if (!favorite) {
      res.status(404)
      throw new Error('Favorite listing not found')
   }

   const removedFavoriteReq = await favorite.remove()

   if (!removedFavoriteReq) {
      res.status(400)
      throw new Error('Favorite listing not removed')
   }

   res.status(200).json({ success: true })
})

module.exports = {
   deleteFavorite,
   createFavorite,
   getFavoritesByUser,
}

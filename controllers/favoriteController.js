const asyncHandler = require('express-async-handler')
const Favorites = require('../models/favoriteModel')
const User = require('../models/userModel')
const APIFeatures = require('../utils/apiFeatures')

// s3 configuration
const {
   S3Client,
   PutObjectCommand,
   GetObjectCommand,
   DeleteObjectCommand,
} = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_VERCEL
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
   region,
   credentials: {
      accessKeyId,
      secretAccessKey,
   },
})
// end s3 configuration

// @desc    create favorite resident listings
// @route   post /api/favorite/
// @access  Private
const createFavorite = asyncHandler(async (req, res) => {
   const { user, listing, listingType } = req.body

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
   const features = new APIFeatures(
      Favorites.find({
         user: req.params.userId,
      }).populate({
         path: 'listing',
         populate: {
            path: 'user',
            select: 'firstname lastname _id',
         },
      }),
      req.query
   )
      .filter()
      .sort()
      .limitFields()
      .paginate()

   const favoriteListings = await features.query

   if (!favoriteListings) {
      res.status(404)
      throw new Error('No favorite listings found')
   }

   // fetching a temporary signed url for each image of each listing
   for (const favorite of favoriteListings) {
      if (favorite.listingType === 'residentListing') {
         if (favorite.listing.imageCover) {
            const getObjectParams = {
               Bucket: bucketName,
               Key: favorite.listing.imageCover,
            }
            const command = new GetObjectCommand(getObjectParams)
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
            favorite.listing.imageCover = url
         } else {
            favorite.listing.imageCover = ''
         }
      }
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

const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const ResidentListing = require('../models/residentListingModel')
const APIFeatures = require('../utils/apiFeatures')
const crypto = require('crypto')

// s3 configuration
const {
   S3Client,
   PutObjectCommand,
   GetObjectCommand,
} = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
   region,
   credentials: {
      accessKeyId,
      secretAccessKey,
   },
})
// end s3 configuration

const generateFileName = (bytes = 32) =>
   crypto.randomBytes(bytes).toString('hex')

// @desc    Get resident listings
// @route   GET /api/resident/
// @access  Private
const getRListings = asyncHandler(async (req, res) => {
   const features = new APIFeatures(ResidentListing.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
   const residentListings = await features.query

   // fetching a temporary signed url for each image of each listing
   for (const listing of residentListings) {
      const getObjectParams = {
         Bucket: bucketName,
         Key: listing.imageCover,
      }
      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
      listing.imageCover = url
   }

   res.status(200).json({
      status: 'success',
      results: residentListings.length,
      data: {
         residentListings,
      },
   })
})

// @desc    Get singular resident listings
// @route   GET /api/resident/:id
// @access  Private
const getRListing = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }

   const residentListing = await ResidentListing.findById(req.params.id)

   if (!residentListing) {
      res.status(404)
      throw new Error('Resident Listing not found')
   }

   const signedImagesURL = []

   // fetching a signeed url for each image of the listing and storing it in an array
   for (const image of residentListing.images) {
      const getObjectParams = {
         Bucket: bucketName,
         Key: image,
      }
      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
	  signedImagesURL.push(url)
   }
   // then we update the listing images with the signed urls
   residentListing.images = signedImagesURL

   res.status(200).json({
      status: 'success',
      data: {
         residentListing,
      },
   })
})

// @desc    delete resident listings
// @route   DELETE /api/resident/:id
// @access  Private
const deleteRListing = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }
   const residentListing = await ResidentListing.findById(req.params.id)

   if (!residentListing) {
      res.status(404)
      throw new Error('Resident listing not found')
   }

   if (residentListing.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('Not Authorized')
   }

   await residentListing.remove()

   res.status(200).json({ success: true })
})

// @desc    update resident listings
// @route   patch /api/resident/listing
// @access  Private
const updateRListing = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }

   const residentListing = await ResidentListing.findById(req.params.id)

   if (!residentListing) {
      res.status(404)
      throw new Error('Resident Listing not found')
   }
   if (residentListing.user.toString() !== req.user.id) {
      res.status(401)
      throw new Error('Not Authorized')
   }
   const updatedResidentListing = await ResidentListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
   )
   res.status(200).json({
      status: 'success',
      data: { updatedResidentListing },
   })
})

// @desc    CREATE resident listing
// @route   POST /api/resident/
// @access  Private
const createRListing = asyncHandler(async (req, res) => {
   const {
      name,
      description,
      cityOfResidence,
      approximateWeight,
      productType,
      price,
      quantity,
      paymentMethod,
   } = req.body

   if (
      !name ||
      !description ||
      !cityOfResidence ||
      !approximateWeight ||
      !productType ||
      !price ||
      !quantity ||
      !paymentMethod
   ) {
      res.status(400)
      throw new Error('Please fill all fields')
   }

   const user = await User.findById(req.user.id)

   if (!user) {
      res.status(401)
      throw new Error('User not found')
   }

   const images = []

   // Loop through the array of files and upload each one
   for (const file of req.files) {
      const newImageName = generateFileName()
      const params = {
         Bucket: bucketName,
         Body: file.buffer,
         Key: newImageName,
         ContentType: file.mimetype,
      }

      await s3.send(new PutObjectCommand(params))

      images.push(newImageName)
   }

   const residentListing = await ResidentListing.create({
      name,
      description,
      cityOfResidence,
      imageCover: images[0],
      images,
      approximateWeight,
      productType,
      price,
      quantity,
      paymentMethod,
      user: req.user.id,
   })

   res.status(201).json({
      status: 'success',
      data: {
         residentListing,
      },
   })
})

module.exports = {
   getRListings,
   getRListing,
   createRListing,
   deleteRListing,
   updateRListing,
}

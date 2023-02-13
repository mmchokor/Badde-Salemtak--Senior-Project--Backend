const express = require('express')

const router = express.Router()
const {
    getListings,
    getListing,
    createListing,
    deleteListing,
    updateListing,
} = require('../controllers/travelerListingControler')

const { protect } = require('../middlewares/authMiddleware')

router.route('/').get(protect, getListings).post(protect, createListing)

router
   .route('/:id')
   .get(protect, getListing)
   .delete(protect, deleteListing)
   .put(protect, updateListing)

module.exports = router

const express = require('express')
const router = express.Router()
const {
   registerUser,
   loginUser,
   getUserInfo,
} = require('../controllers/userController')

const { protect } = require('../middlewares/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getUserInfo)

module.exports = router

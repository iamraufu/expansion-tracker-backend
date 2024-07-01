const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
    registerLandlord,
    getAllLandlords,
    getOneLandlord,
    updateLandlord,
} = require('../controllers/LandlordController')

router.post('/register', registerLandlord) // Create investor
router.post('/', getAllLandlords) // get all
router.get('/:id', getOneLandlord) 
router.patch('/:id', updateLandlord) 
module.exports = router
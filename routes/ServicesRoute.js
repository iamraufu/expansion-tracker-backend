const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
investorAndLandlordData
} = require('../controllers/ServicesController')


router.post('/partners', tokenVerify, investorAndLandlordData) // get all


module.exports = router
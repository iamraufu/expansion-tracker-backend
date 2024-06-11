const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
investorAndLandlordData,
getOneSiteWithPartners,
checkOwnerTasks
} = require('../controllers/ServicesController')


router.post('/partners', tokenVerify, investorAndLandlordData) // get all
router.post('/site/:id', tokenVerify, getOneSiteWithPartners) // get all
router.get('/task/:id/:type', tokenVerify, checkOwnerTasks) // get all


module.exports = router
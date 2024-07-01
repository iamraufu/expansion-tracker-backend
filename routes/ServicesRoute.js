const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
investorAndLandlordData,
getOneSiteWithPartners,
checkOwnerTasks,
managerAssign
} = require('../controllers/ServicesController')


router.post('/partners', tokenVerify, investorAndLandlordData) 
router.post('/site/:id', tokenVerify, getOneSiteWithPartners) 
router.get('/task/:id/:type', tokenVerify, checkOwnerTasks) 
router.patch('/managerAssign', tokenVerify, managerAssign) 


module.exports = router
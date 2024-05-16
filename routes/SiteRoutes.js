const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
    getAllSites,
    getOneSite,
    registerSite,
    updateSite
    // updateLandlord,
} = require('../controllers/SiteController')

router.post('/register', registerSite) // Create investor
router.post('/', getAllSites) // get all
router.get('/:id', getOneSite) // get one

module.exports = router
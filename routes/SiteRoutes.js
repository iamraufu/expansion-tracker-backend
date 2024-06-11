const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
    getAllSites,
    getOneSite,
    registerSite,
    updateSite

} = require('../controllers/SiteController')

router.post('/register', registerSite) // Create investor
router.post('/', tokenVerify, getAllSites) // get all
router.patch('/update/:id', tokenVerify, updateSite) // get all
router.get('/:id', tokenVerify, getOneSite) // get one

module.exports = router
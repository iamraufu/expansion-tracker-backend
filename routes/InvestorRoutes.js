const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
    registerInvestor,
    getAllInvestors,
    getOneInvestor,
    updateInvestor
} = require('../controllers/InvestorController')

router.post('/register', registerInvestor) // Create investor
router.post('/', getAllInvestors) // get all
router.get('/:id', getOneInvestor) // get one
router.patch('/:id', updateInvestor) // get one

module.exports = router
const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
    registerInvestor,
    getAllInvestors,
    getOneInvestor
} = require('../controllers/InvestorController')


router.post('/register', registerInvestor) // Create investor
router.post('/', getAllInvestors) // get all
router.get('/:id', getOneInvestor) // get one   
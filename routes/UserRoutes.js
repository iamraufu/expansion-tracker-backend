const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      register,
      login,
      users,
      user,
      update,
      alive,
      changePassword
} = require('../controllers/UserController')

router.get('/alive', alive) // Create an user
router.post('/register', register) // Create an user
router.post('/login', login) // Login
router.post('/', tokenVerify, users) // Get all users
router.get('/:id', tokenVerify, user) // Get single user
router.patch('/:id', tokenVerify, update) // Update single user
router.post('/change-password', tokenVerify, changePassword) // Update single user

module.exports = router
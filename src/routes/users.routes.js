const express = require('express')
const router = express.Router()

const UserController = require('../controllers/userscontroller')

router.get('/users', UserController.getAllUsers)
router.post('/users', UserController.createUser)
router.put('/users/:id', UserController.updateUser)
router.get('/users/:id', UserController.getUserById)
router.post('/users/:id', UserController.deleteUser)

module.exports = router